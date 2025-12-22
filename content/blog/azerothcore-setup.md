---
title: 'AzerothCore Development Setup (Linux)'
description: 'A Linux-focused, stock AzerothCore development environment designed for effective triage, PR validation, and cross-core comparison.'
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

- Cross-core comparison (AzerothCore, TrinityCore, CMaNGOS, VMaNGOS, TSWoW)
- Clean before/after validation when working on bugs or pull requests
- Reduced duplicate effort across the 3.3.5 open-source ecosystem

> **TL;DR**
> AzerothCore issue: Buggy **Traveler's Tundra Mammoth** vendors
:::vue
<GitHubIssueLink owner="azerothcore" repo="azerothcore-wotlk" number="3778" />
:::

>
> Cross-core insights:
> - CMaNGOS has a working implementation
>
> Booting other cores can reveal systems that are missing or incomplete. This setup emphasizes **stock correctness** while leveraging cross-core comparisons to identify and address gaps in AzerothCore.

## Philosophy: Why This Setup Exists

AzerothCore is GPLv2-licensed and governed by explicit contribution guidelines.

### Why Multiple Cores?

Running multiple 3.3.5 and 1.12 cores side-by-side allows you to:

- Confirm whether a behavior is missing, or incorrect
- Avoid re-implementing already-solved systems

You _can_ run all of them simultaneously.
You probably _should not_, unless you are actively triaging.

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

## High-Level Architecture

### Core Concepts

- **Dual-database strategy** (dev vs reference)
- **Containerized databases** to avoid host conflicts
- **Multiple cores** isolated by ports and credentials

## Stock vs Modding (Important Distinction)

### Acceptable for Stock Development

Examples that **do not alter stock gameplay**:

- NPCs that instantly gear characters for testing
- Skipping DK starting zone to test spell interactions
- Test-only vendors or teleporters

These exist solely to accelerate validation.

### Out of Scope (for This Article)

- Client-side modding
- Gameplay alterations

> The more client and server drift you introduce, the harder it becomes to reason about stock correctness.

## Dual Database Setup (AzerothCore)

Separating databases has proven extremely valuable during development.

### Why Two Databases?

- **Source DB**
  - Treated as read-only
  - Represents a known-good reference state

- **Dev DB**
  - Frequent changes
  - SmartAI edits
  - Safe to break

This approach avoids repeated `DROP DATABASE + import` cycles and works particularly well with **Keira3**, where you can diff and selectively restore entries.

### MySQL Initialization

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

### Docker Compose (Dual DB)

```yaml
services:
  ac-database:
    image: mysql:8.0
    container_name: ac-database
    command: --secure-file-priv="" --local-infile=1
    ports:
      - 3311:3306
    environment:
      - MYSQL_ROOT_PASSWORD=password
    volumes:
      - ac-database:/var/lib/mysql-ac
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
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

Allows us to run Keira3 on separate ports 3311 and 3312. It's easy to add more containers if you need to work on modules, playerbots, etc.

## Core setup

Fedora 42

Local setup. This should be OK for AC. But may be incompatible. When in doubt, use official instructions for Ubuntu LTS either in a distrobox or VM (see below). Local setup is what I prefer due to ease of debugging.

```zsh
dnf group install c-development
dnf install boost cmake openssl-devel readline-devel bzip2 clang lldb lld clang-format clang-tidy boost-devel
```

### Other Cores (Cross-Reference Setup)

General Advice

Follow each project’s official wiki

Avoid polluting the host system

Isolate via containers, VMs, or Distrobox

#### TrinityCore 3.3.5 (Distrobox)

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

#### CMaNGOS / VMangos (VM)

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

## Working with DBC Data

DBC files are opaque and painful to inspect.

Use `wow_dbc_converter` to convert DBC to SQLite.

https://github.com/gtker/wow_dbc

This enables:

Fast inspection

SQL querying

## Dotfiles

VSCode setup (lldb, gdb)
conf.sh (Debug, ASAN)
.clangd files (formatter, clang-tidy checks)

https://gist.github.com/sogladev/c90aa1562b6f60d624b154366e868560

## Tools

Sniffer
https://github.com/TrinityCore/ymir
https://www.azerothcore.org/wiki/sniffing-and-parsing

Sniff parsing
https://github.com/BAndysc/WoWDatabaseEditor

Spell DBC
https://github.com/azerothcore/SpellWork

https://github.com/stoneharry/WoW-Spell-Editor

https://github.com/freadblangks/WDBXEditor

wow_dbc



## Future

Multi-workspace client setup to avoid disk duplication

Server and Client-side modding

Modules and Characters setup

MCP Server
