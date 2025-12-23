---
title: 'Realmctl'
description: 'Rust CLI tool to launch World of Warcraft clients, switch realmlist targets, and manage disk-efficient workspaces from a single config.'
tags: ['rust', 'cli', 'wow', 'tooling']
image: '/images/projects/rs-realmctl.svg'
repo: 'https://github.com/sogladev/rs-realmctl'
featured: false
---

# Realmctl

Realmctl is a small Rust-based command-line tool that makes it easy to launch different World of Warcraft clients, switch between local and remote realms, and manage multiple installs without wasting disk space.

## Why I Built It

Originally, this started as a couple of shell aliases:

- `WOWL` to point a 3.3.5a client at a **local** private server
- `WOWC` to point the same client at a **live** realm

Doing this manually meant constantly editing `realmlist.wtf` by hand, which was tedious and error-prone. The first version was just a Bash script, but I wanted:

- A **single binary** I could drop on any machine (including Windows)
- A **typed config file** (`config.toml`) instead of ad-hoc shell parsing
- A nicer way to evolve features over time (aliases, launch commands, workspaces)

Rewriting it in Rust turned a throwaway script into a small but solid tool I can version, package, and reuse.

## What It Does

- **Launch WoW clients via aliases** (e.g. `WOWC`, `WOWL`) using a simple `config.toml`
- **Set and switch `realmlist.wtf`** automatically before launch
- **Print account credentials** and optionally copy the password to the clipboard
- **Customize launch commands** (e.g. `lutris`, Wine, or native executables)
- **Support multiple client layouts** by configuring paths in `config.toml`
- **Manage workspaces** (newer feature) so you can:
  - Create multiple logical WoW installs from a single large base client
  - Share base data while keeping separate addons / WTF configs
  - Clean caches and logs per workspace to keep things tidy

Under the hood, Realmctl knows where your client lives, where `realmlist.wtf` is, and how to launch the game, so your shell aliases stay simple.

## Workspaces: Saving Disk Space

A later evolution of the tool was adding **workspace support**:

- Initialize a **base** 17GB WoW client once
- Create multiple **lightweight workspaces** for different realms or patch sets
- Share large, immutable data files via hard links
- Keep per-workspace configs, addons, and ephemeral data separate

This makes it realistic to manage several AzerothCore/Chromiecraft-style setups without multiplying your disk usage.

## Tech Stack

- **Rust** binary built with Cargo
- **TOML** configuration for launch targets and realms
- Simple **Unix-style aliases** (`WOWC`, `WOWL`, etc.) for everyday use

The project is intentionally kept small and focused: fast compile times, minimal dependencies, and a clear separation between configuration (`config.toml`) and runtime behavior.

## Links

- Source code and releases: https://github.com/sogladev/rs-realmctl
- Full README with commands, workspace examples, and alias setup: see the repository
