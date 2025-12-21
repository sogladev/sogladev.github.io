---
title: 'AzerothCore Setup Guide'
description: 'A complete guide to setting up and running AzerothCore locally for World of Warcraft private server development.'
tags: ['cpp', 'sql', 'guide', 'azerothcore']
date: 2025-01-15
author: 'Your Name'
---

# AzerothCore Setup Guide

This guide will walk you through setting up AzerothCore, a complete open-source World of Warcraft server emulator.

## Prerequisites

Before getting started, ensure you have the following installed:

- Git
- CMake (3.16+)
- MySQL 8.0+
- C++ compiler (GCC 11+ or Clang 12+)
- OpenSSL

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/azerothcore/azerothcore-wotlk.git
cd azerothcore-wotlk
```

### 2. Configure the Build

```bash
mkdir build
cd build
cmake ../ -DCMAKE_INSTALL_PREFIX=$HOME/azeroth-server
```

### 3. Compile the Source

```cpp
// Example configuration snippet
struct WorldConfig {
    uint32 port = 8085;
    std::string dataDir = "./data";
    bool enableConsole = true;
};
```

### 4. Database Setup

Create the required databases:

```sql
CREATE DATABASE acore_world;
CREATE DATABASE acore_characters;
CREATE DATABASE acore_auth;

GRANT ALL PRIVILEGES ON acore_world.* TO 'acore'@'localhost';
GRANT ALL PRIVILEGES ON acore_characters.* TO 'acore'@'localhost';
GRANT ALL PRIVILEGES ON acore_auth.* TO 'acore'@'localhost';
```

### 5. Configure the Server

Edit your `worldserver.conf`:

```yml
DataDir: './data'
LogsDir: './logs'
LoginDatabaseInfo: '127.0.0.1;3306;acore;password;acore_auth'
WorldDatabaseInfo: '127.0.0.1;3306;acore;password;acore_world'
CharacterDatabaseInfo: '127.0.0.1;3306;acore;password;acore_characters'
```

## Running the Server

Start the world server:

```bash
./worldserver
```

## Conclusion

You now have a fully functional AzerothCore server running locally. Check out the official documentation for advanced configuration options.
