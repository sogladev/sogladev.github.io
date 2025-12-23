---
title: 'AzerothCore Development Setup (Linux)'
description: 'A Linux-focused, stock AzerothCore development environment.
tags:
  [
    'cpp',
    'docker',
    'guide',
    'azerothcore',
    'wow-emulation',
    'linux',
    'mysql',
  ]
---

# AzerothCore Development Setup

This article documents a **Linux-focused AzerothCore development setup** aimed at contributors working on **stock 3.3.5 (WotLK)** behavior.

The goal is not merely to “run AzerothCore,” but to create a **development environment** that supports:

- **Efficient Triage**: Quickly validate before-and-after behavior when developing, debugging, or testing pull requests
- **Context Switching**: Easy switching between stock and custom development workflows
- **Rapid Environment Setup**: Spin up new environments for testing modules or specific features without disrupting the primary setup
- **Cross-Reference Development**: Identify and leverage already-solved systems from other cores, reducing redundant work

I focus on high-level concepts and workflows rather than exhaustive
step-by-step instructions; some commands or details may be incorrect, missing,
or out of date.

## Scope and Assumptions

### Assumed Knowledge

This guide builds on the official documentation:

- [AzerothCore Classic Installation Guide](https://www.azerothcore.org/wiki/classic-installation)

You are expected to already have:

- A working AzerothCore checkout
- Maps, DBCs, and vmaps extracted
- Basic familiarity with MySQL and Linux tooling

This article **links**, rather than repeats, foundational steps.

### Platform Focus

- Primary target: **Linux**
- Tested on: Fedora 42
- Some steps may apply to other distros or macOS, but are not guaranteed

## Stock vs Modding

This is important distinction to make. In AC we focus on 335 blizzlike, anything that drifts makes it harder to reason about stock correctness

### Acceptable for Stock Development

Examples that **do not alter stock gameplay**:

- NPCs that instantly gear characters for testing
- Skipping DK starting zone to test spell interactions
- Test-only vendors or teleporters

It's best to avoid usage of:

- Client modifications, like patches (`.MPQ`) and most addons
- Modules that alter behavior, like progression modules

## Dual Database Setup

Separating databases has proven valuable during development.

- **Dev DB**
  - Frequent changes
  - SmartAI edits
  - Safe to break

- **Source DB**
  - Treated as read-only
  - Represents a known-good reference state

This approach avoids repeated `DROP DATABASE + import` cycles and works particularly well with [**Keira3**](https://github.com/azerothcore/Keira3), where you can diff and selectively restore entries.

### MySQL Initialization

[Wiki Database Installation](https://www.azerothcore.org/wiki/database-installation)

### MySQL Initialization Script

Below is a modified `create_mysql.sql` file tailored for use in our Docker environment. This script also sets up additional databases for tooling, such as `acore_spells` (used by [WoW-Spell-Editor](https://github.com/stoneharry/WoW-Spell-Editor)) and `acore_dbc` (used by [WDBXEditor](https://github.com/freadblangks/WDBXEditor)).

This script ensures a clean and consistent setup for both core development and tooling needs.

```sql
-- MySQL 8.0.x
DROP USER IF EXISTS 'acore'@'%';
CREATE USER 'acore'@'%' IDENTIFIED WITH mysql_native_password BY 'acore'
WITH MAX_QUERIES_PER_HOUR 0
     MAX_CONNECTIONS_PER_HOUR 0
     MAX_UPDATES_PER_HOUR 0;

CREATE DATABASE IF NOT EXISTS `acore_world` DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `acore_characters` DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `acore_auth` DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `acore_world`.* TO 'acore'@'%';
GRANT ALL PRIVILEGES ON `acore_characters`.* TO 'acore'@'%';
GRANT ALL PRIVILEGES ON `acore_auth`.* TO 'acore'@'%';

-- Optional tooling databases
CREATE DATABASE IF NOT EXISTS `acore_spells`;
CREATE DATABASE IF NOT EXISTS `acore_dbc`;

GRANT ALL PRIVILEGES ON `acore_spells`.* TO 'acore'@'%';
GRANT ALL PRIVILEGES ON `acore_dbc`.* TO 'acore'@'%';
```

### Docker Compose

```yaml
services:
  ac-database:
    image: mysql:8.0
    container_name: ac-database
    command: --secure-file-priv="" --local-infile=1 # required for WDBXEditor export
    ports:
      - 3311:3306
    environment:
      - MYSQL_ROOT_PASSWORD=password
    volumes:
      - ac-database:/var/lib/mysql-ac
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro # modify path for init.sql as needed
    restart: unless-stopped

  ac-database-2:
    image: mysql:8.0
    container_name: ac-database-2
    command: --secure-file-priv="" --local-infile=1
    ports:
      - 3312:3306
    environment:
      - MYSQL_ROOT_PASSWORD=password
    volumes:
      - ac-database-2:/var/lib/mysql-ac-2
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    restart: unless-stopped

volumes:
  ac-database:
  ac-database-2:
```

This database setup allows running multiple cores simultaneously while using tools like Keira3. By separating the development database (port 3311) and the reference database (port 3312), you can easily compare and validate changes.

If you need to work on additional modules, playerbots, or other features, it's straightforward to add more containers. Simply replicate the existing Docker Compose service definitions, adjusting ports, volumes and config values as needed to avoid port conflicts.

## Core Setup

We don't need additional dependencies beyond those listed in the [official wiki](https://www.azerothcore.org/wiki/linux-requirements).

While this approach is unofficially unsupported, it should work fine for AzerothCore. When in doubt, refer to the official instructions for Ubuntu LTS, either in a Distrobox or VM.

Fedora 43 Setup:

```zsh
dnf group install c-development
# Additional packages (some may already be included in the group)
dnf install boost cmake openssl-devel readline-devel bzip2 clang lldb lld clang-format clang-tidy boost-devel
```

### Build and Compilation

For convenience, we can use the `acore.sh` utility and `conf/config.sh` to manage the build configuration.

Below is part of `conf/config.sh`:

```shell
CDEBUG=ON
CTYPE=Debug
CCUSTOMOPTIONS=' -DCMAKE_C_FLAGS="-fsanitize=address" -DCMAKE_CXX_FLAGS="-fsanitize=address" -DCMAKE_EXE_LINKER_FLAGS="-fsanitize=address"'
export ASAN_OPTIONS=${ASAN_OPTIONS:-"detect_leaks=1:halt_on_error=1:allocator_release_delay=1:verbosity=1:print_stats=1:fast_unwind_on_malloc=0"}
export ASAN_SYMBOLIZER_PATH=${ASAN_SYMBOLIZER_PATH:-"/usr/bin/llvm-symbolizer"}
```

- **CDEBUG**: Enables debug symbols for easier debugging.
- **CTYPE**: Sets the build type to `Debug` for development purposes.
- **CCUSTOMOPTIONS**: Adds custom compiler options, such as enabling Address Sanitizer (ASAN) for detecting memory issues.
- **ASAN_OPTIONS**: Configures AddressSanitizer runtime options, such as enabling leak detection and providing detailed error messages.
- **ASAN_SYMBOLIZER_PATH**: Specifies the path to the symbolizer tool for better stack traces.

You can find a `config.sh` file in this [Github gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560).

### Avoiding Port Conflicts

Once the initial build is done, we first need to setup our config values before we can run the auth and worldserver.

When running multiple worldservers at once, we need to ensure we do not conflict ports:

| Service                | Default Port | ac1 Port | ac2 Port |
| ---------------------- | ------------ | -------- | -------- |
| DB                     | 3306         | 3311     | 3312     |
| World                  | 8085         | 8085     | 8086     |
| Auth                   | 3724         | 3724     | 3725     |
| acore_auth.realmlist\* | 8085         | 8085     | 8086     |
| realmlist.wtf          | 3724         | 3724     | 3725     |

These ports are set in `worldserver.conf`, `authserver.conf` and in the DB under `acore_auth.realmlist`. The client auth port needs to match client's `realmlist.wtf` (`set realmlist 127.0.0.1:3725`)

### Populate the DB

\* `authserver` needs to be launched to populate the `acore_auth.realmlist`, updated then restarted.

My prefered account setup is to have admin acocunts `q/q`, `w/w`, `e/e`, `r/r`, `t/t` and player `p/p` set for easy logins.

```zsh
account create q q
account set gmlevel q 3 -1
```

`worldserver` with `./worldserver -d`. This peforms a dry run to populate the DB, and automaticly shut down.

I always run the worlserver directly to populate the DB, as running it through GDB (or LLDB) takes much longer.

You may find this alias useful to quickly drop the DB

```zsh
alias drop="mysql --protocol=TCP -h 127.0.0.1 -P 3311 -u acore -p'acore' -e 'DROP SCHEMA \`acore_world\`;'"
```

### Using Git Worktree

Instead of duplicating the entire repository for each core setup, you can use Git worktree to manage multiple working directories from a single Git repository. This approach allows you to work on different configurations or branches simultaneously.

Not all files are shared between worktrees. For example, modules, configuration files (`worldserver.conf`, `authserver.conf`), and build directories need to be set up separately for each worktree. Assign a new set of ports in the configuration files to avoid conflicts.

Build the core and populate the databases as usual:

```bash
./acore.sh compiler build
./worldserver -d
./authserver -d
```

For more details, refer to the [Git worktree documentation](https://git-scm.com/docs/git-worktree).

By using Git worktree, you can efficiently manage multiple core setups while avoiding unnecessary duplication.

Lastly, we also need to modify the `acore_auth.realmlist` entry and `realmlist.wtf` in the client.

I wrote a utility to help change the `realmlist.wtf` file dynamically when launching clients via the terminal. Once configured, this utility allows you to connect to different servers by specifying the desired server alias, e.g., `$ WOWL` or `$ WOWL2`.

The utility is available on GitHub: [wow-realm-switch-utility](https://github.com/sogladev/wow-realm-switch-utility).

## IDE Configuration

Use `.clang-format` for formatting and clang-tidy checks. Example configurations are available in this [Github gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560).

Also see [AzerothCore - Discussions - .clang-format](https://github.com/azerothcore/azerothcore-wotlk/discussions/20750).

### VS Code Debugging

For debugging, use the `launch.json` file to attach to `worldserver`. Find an example in this [Github gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560).

**Recommended Extension**: Use [clangd extension](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) instead of the default Microsoft C++ extension.

## Tools

The following tools are primarily Windows-based but can be run via Wine on Linux or within a Windows VM:

- [Keira3](https://github.com/azerothcore/Keira3): AzerothCore-specific database editor.
- [WoWDatabaseEditor](https://github.com/BAndysc/WoWDatabaseEditor): Useful for sniff parsing, best used in a Windows VM.
- [SpellWork](https://github.com/azerothcore/SpellWork): Inspects spell data.
- [wow_dbc_converter](https://github.com/gtker/wow_dbc): Converts DBC files to SQLite for easier querying.
- [Ymir](https://github.com/TrinityCore/ymir): (Windows only) A sniffer tool.
- [WoW-Spell-Editor](https://github.com/stoneharry/WoW-Spell-Editor): Modding tool for server-side spell editing.
- [WDBXEditor](https://github.com/freadblangks/WDBXEditor): (Modding) Edits WDB and DBC files.
- [aowow](https://wowgaming.altervista.org/aowow): web database viewer

[wiki - Useful Tools](https://www.azerothcore.org/wiki/useful-tools)

## Other Cores (Cross-Reference Setup)

- Refer to each project's official wiki for accurate guidance.
- Use containers, VMs, or Distrobox to avoid dependency conflicts on the host system.
- Adjust ports to prevent conflicts across services like `worldserver`, `authserver`, `DB`, `authserver.realmlist`, and the client's `realmlist.wtf`.

### TrinityCore 3.3.5 (Distrobox)

[TrinityCore - Linux Core Installation](https://trinitycore.info/install/Core-Installation/linux-core-installation)

Use a containerized DB (see above) with the following `init.sql`.

We build the core inside a [Distrobox](https://distrobox.it). You can find a `distrobox.ini` file here [Github gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560).

```sql
CREATE USER 'trinity'@'%' IDENTIFIED BY 'trinity';

CREATE DATABASE world;
CREATE DATABASE characters;
CREATE DATABASE auth;

GRANT ALL PRIVILEGES ON world.* TO 'trinity'@'%';
GRANT ALL PRIVILEGES ON characters.* TO 'trinity'@'%';
GRANT ALL PRIVILEGES ON auth.* TO 'trinity'@'%';
```

(Docker Compose unchanged from source notes.)

### CMaNGOS (Ubuntu 22.04 VM)

[CMaNGOS Installation Guide](https://github.com/cmangos/issues/wiki/Installation-Instructions)

1. **Setup VM**: Create an Ubuntu 22.04 server VM.
2. **SSH Alias**: Add an alias for quick access:
  ```bash
  ssh -i ~/.ssh/id_rsa ubuntu@192.168.XXX.XXX
  ```
3. **MySQL Configuration**: Allow external connections:
  ```bash
  sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
  # Set bind-address to 0.0.0.0
  sudo systemctl restart mysql
  ```

### VMangos (Same VM)

[VMaNGOS Linux Setup Gist](https://gist.github.com/0blu/14ce41e31f8c44ca3096add4638056ad).

1. Follow the [VMaNGOS Wiki](https://github.com/vmangos/wiki) for setup.
2. Add a realm entry:
  ```sql
  INSERT INTO realmlist (id, name, address, port, icon, realmflags, timezone, allowedSecurityLevel)
  VALUES (1, 'VMangos', '192.168.122.202', 8086, 1, 0, 1, 0);
  ```
3. Use pre-extracted maps from a repack (e.g., [Brotalnia's Repack](https://www.ownedcore.com/forums/world-of-warcraft/world-of-warcraft-emulator-servers/wow-emu-general-releases/613280-elysium-core-1-12-repack-including-mmaps-optional-vendors.html)) to save time.

## Server config snippets (worldserver.conf / authserver.conf)

Below are useful `authserver.conf` and `worldserver.conf` settings.

### Example `authserver.conf`

```ini
# Authentication server
RealmServerPort = 3724
LoginDatabaseInfo = "127.0.0.1;3311;acore;acore;acore_auth"
```

### Example `acore_auth.realmlist`

|id|name|address|localAddress|localSubnetMask|port|
|--|----|-------|------------|---------------|----|
|1|AzerothCore 2|127.0.0.1|127.0.0.1|255.255.255.0|8086|

### Example `worldserver.conf`

```ini
# Networking
WorldServerPort = 8085

# Database connections
LoginDatabaseInfo     = "127.0.0.1;3311;acore;acore;acore_auth"
WorldDatabaseInfo     = "127.0.0.1;3311;acore;acore_world"
CharacterDatabaseInfo = "127.0.0.1;3311;acore;acore_characters"

# Paths (set to your repo/build layout)
DataDir=
LogsDir=

# Logging / packet capture
PacketLogFile = "world.pkt"

# Gameplay / economy tweaks useful for testing
StartPlayerMoney = 1000000000
StartHeroicPlayerMoney = 1000000000

# Instance / group tweaks
Group.Raid.LevelRestriction = 1
Instance.IgnoreRaid = 1
AllowTwoSide.Interaction.* = 1

# Set Logger configs to "5" for debug info
; Logger = 5
```
## Future Posts

- **Multi-Workspace Client Setup**: avoid disk duplication while maintaining separate environments for modded and stock clients.
- **Modules, Addons, and Character Setup**: Best practices for setting up and managing modules, addons, and character configurations for testing and development.
- **Client-side modding**