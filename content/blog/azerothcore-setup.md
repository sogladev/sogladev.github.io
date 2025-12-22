---
title: 'AzerothCore Development Setup (Linux)'
description: 'A Linux-focused, stock AzerothCore development environment designed for effective triage and PR validation.'
tags:
  [
    'cpp',
    'sql',
    'guide',
    'azerothcore',
    'wow-emulation',
    'linux',
    'mysql',
    'docker'
  ]
date: 2025-01-01
---

# AzerothCore Development Setup

This article documents a **Linux-focused AzerothCore development setup** aimed at contributors working on **stock 3.3.5 (WotLK)** behavior.

The goal is not merely to “run AzerothCore,” but to create a **development environment** that supports:

- Clean before/after validation when working on bugs or pull requests
- Easy context switching between stock and custom development

I focus on high-level concepts and workflows rather than exhaustive
step-by-step instructions; some commands or details may be incorrect, missing,
or out of date.


## Why This Setup Exists

Running multiple 3.3.5 cores side-by-side offers several advantages over a stock installation:

- Avoid Redundant Work: Identify and leverage already-solved systems from other cores, reducing the need to re-implement functionality.
- Efficient Triage: Quickly validate before-and-after behavior when developing, debugging, or testing pull requests.
- Rapid Environment Setup: Spin up new environments for testing module setups or specific features without disrupting the primary setup.

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

These exist solely to accelerate validation.

It's best to avoid usage of:
- Client modifications, like patches (`.MPQ`) and addons
- Modules that alter behavior, like progression modules

## Dual Database Setup

Separating databases has proven extremely valuable during development.

### Why Two Databases?

- **Source DB**
  - Treated as read-only
  - Represents a known-good reference state

- **Dev DB**
  - Frequent changes
  - SmartAI edits
  - Safe to break

This approach avoids repeated `DROP DATABASE + import` cycles and works particularly well with [**Keira3**](https://github.com/azerothcore/Keira3), where you can diff and selectively restore entries.

### MySQL Initialization

https://www.azerothcore.org/wiki/database-installation

Modified `create_mysql.sql` file for use in our docker environment.

This also sets up additional databases for tooling. Namely, `acore_spells` for use by [WoW-Spell-Editor](https://github.com/stoneharry/WoW-Spell-Editor)
and `acore_dbc` by [WDBXEditor](https://github.com/freadblangks/WDBXEditor)

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

This DB setup allows us to run Keira3 on separate ports 3311 and 3312. It's easy to add more containers if you need to work on modules, playerbots, etc.

## Core setup

We don't need any extra dependencies that are listed in official wiki install.

Altough unofficialy unsupported, this should be OK for AC. When in doubt, use official instructions for Ubuntu LTS either in a distrobox or VM (see below). Local setup is what I prefer due to ease of debugging.

This should work on Fedora 43 (untested):
```zsh
dnf group install c-development
# extra (some are already covered by the group)
dnf install boost cmake openssl-devel readline-devel bzip2 clang lldb lld clang-format clang-tidy boost-devel
```

### Compile

For convenience, we can make use of the `acore.sh` utility and setup a config with file `/conf/config.sh`

You may find the `config.sh` file in here the [dotfile gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560)

Config values that are set are: DEBUG build and Address Sanitizer (ASAN).

### Config

Once the initial build is done, we first need to setup our config values before we can run the auth and worldserver.

When running multiple worldservers at once, we need to ensure we do not conflict ports:

| Service | Default Port | ac1 Port | ac2 Port |
|---------|--------------|----------|----------|
| DB      | 3306         | 3311     | 3312     |
| World   | 8085         | 8085     | 8086     |
| Auth    | 3724         | 3724     | 3725     |
| acore_auth.realmlist*    | 8085         | 8085     | 8086     |
| realmlist.wtf    | 3724         | 3724     | 3725     |


These ports are set in `worldserver.conf`, `authserver.conf` and in the DB under `acore_auth.realmlist`. The client auth port needs to match client's `realmlist.wtf` (`set realmlist 127.0.0.1:3725`)

### Populate the DB

\* `authserver` needs to be launched to populate the `acore_auth.realmlist`, updated then restarted.

My prefered account setup is to have admin acocunts `q/q`, `w/w`, `e/e`, `r/r`, `t/t` and player `p/p` set for easy logins.

```zsh
account create q q
account set gmlevel q 3 -1
```

`worldserver` with `./worldserver -d`. This peforms a dry run and automaticly shut down.

I always run the worlserver directly to populate the DB, as running it through GDB (or LLDB) takes much longer.

You may find this alias useful to quickly drop the DB
```zsh
alias drop="mysql --protocol=TCP -h 127.0.0.1 -P 3311 -u acore -p'acore' -e 'DROP SCHEMA \`acore_world\`;'"
```

### The second core

You could simly copy paste and repeat the entire process, but a better approach is to use git workspaces.

This allows us to specify a new workspace folder, compile and run. We need to configure worldserver.conf, authserver.conf, conf.sh, modules.

We use the same `./worldserver -d` and `authserver -d` to populate the DB's.

### Launching the client

Lastly, we also need to modify the `realmlist.wtf` in the client, so we can connect to our realm.

I wrote a utility to help change realmlist when launching clients by terminal. https://github.com/sogladev/wow-realm-switch-utility

You may also use this to launch different client executables, e.g., for different clients / client versions. This way you can setup a modded client, and a stock client.

## IDE Config files

If you use VScode, you may want to check out clangd extension, setup `compilation-commands.json`, and `launch.json`.

.clangd files (formatter, clang-tidy checks) can be useful.

Found at [dotfile gist](https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560)

## Tools

The following tools are primarily Windows-based. They can be run through Wine on Linux or within a Windows virtual machine (VM):

### Database Editors
- [Keira3](https://github.com/azerothcore/Keira3): A database editor specifically designed for AzerothCore.

### DBC Tools
- [SpellWork](https://github.com/azerothcore/SpellWork): A tool for inspecting and editing spell data (can be run via Wine). Commonly used.
- [WoW-Spell-Editor](https://github.com/stoneharry/WoW-Spell-Editor): A spell editor for WoW (can be run via Wine). Modding tool, can be useful when making server-side spells.
- [WDBXEditor](https://github.com/freadblangks/WDBXEditor): A tool for editing WDB and DBC files (can be run via Wine). More of a modding tool.
- [wow_dbc_converter](https://github.com/gtker/wow_dbc): Converts DBC files to SQLite for easier querying and inspection. Used only once.

### Sniffing and Parsing
- [Ymir](https://github.com/TrinityCore/ymir): A sniffer tool (not compatible with Linux).
- [WoWDatabaseEditor](https://github.com/BAndysc/WoWDatabaseEditor): A tool for parsing sniffs, best used in a Windows VM.


## Other Cores (Cross-Reference Setup)

General Advice

Follow each project’s official wiki

Avoid polluting the host system with dependencies.

Isolate via containers, VMs, or Distrobox

Ports may need to be changed to avoid conflicts: worldserver, authserver, DB authserver.realmlist, and client's realmlist.wtf

### TrinityCore 3.3.5 (Distrobox)

Use a containerized DB and build the core inside Distrobox.

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

### CMaNGOS / VMangos (VM)

Why Vanilla Matters

Some systems implemented correctly in 1.12, not found in 3.3.5.

For example Guard assistance behavior

Realmlist entry:

```sql
INSERT INTO realmlist
(id, name, address, port, icon, realmflags, timezone, allowedSecurityLevel)
VALUES
(1, 'VMangos', '192.168.122.202', 8086, 1, 0, 1, 0);
```

## Future

Multi-workspace client setup to avoid disk duplication and separate modded vs stock clients

Server and Client-side modding

Modules, addons and Characters setup

MCP Server
