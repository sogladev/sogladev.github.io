---
title: 'Home Media Server Stack'
description: 'Docker-based home media server stack with Portainer, Traefik, and automated dependency management, focused on practical DevOps and self-hosted media.'
tags: ['devops', 'docker', 'self-hosting', 'automation', 'media-server']
image: '/images/projects/home-media-server.svg'
repo: 'https://github.com/sogladev/home-media-server'
featured: false
---

# Home Media Server Stack

This project is a practical, reproducible **home media server** stack built around Docker. It brings together media, automation, and bookmarking tools (Plex/Jellyfin, Sonarr/Radarr/Lidarr, Transmission, Prowlarr, Freshrss, Linkwarden, Calibre, Copyparty, and more) into a single, documented setup.

## Why I Built It

I wanted a **self-hosted media environment** that was:

- Easy to **reproduce** on a new machine
- Easy to **update** without breaking everything
- Transparent enough that I fully understood what each container was doing

Instead of following a one-off YouTube tutorial and ending up with a fragile pile of containers, this repo is structured as a **versioned, linted, and automated stack**:

- Clear **folder layout** for `appdata/` and `data/` volumes
- Compose files that are **portable** and **documented**
- Configuration guidance for each major service in the README

It doubles as a living lab for Docker, reverse proxies, and DevOps practices.

## DevOps & Automation Highlights

- **Docker Compose–first design**: All services are defined via `docker-compose.yml` variants, so the entire stack can be brought up or down with a single command.
- **Portainer support**: Compose files are written to be **dropped into Portainer** for click‑to‑deploy management, making updates and restarts trivial.
- **Reverse proxy setup**: Optional Traefik stack for unified, friendly URLs and TLS, adapted from community best practices and tuned for DuckDNS.
- **Linter integration**: A linter is used to keep the compose and configuration files clean and consistent, catching issues early.
- **Renovate for dependencies**: A `renovate.json` configuration automates **dependency updates and pinning**, keeping container images and versions fresh without manual tracking.

Together, these choices turn “some Docker commands in a shell history” into a maintainable, inspectable home infrastructure.

## Practical Systems Configuration

The stack is designed for **real-world home use**:

- Opinionated **folder structure** for media and app data so backups and migrations are predictable
- Clear **port mappings and hostnames** for each service (e.g., `bazarr`, `radarr`, `sonarr`, `transmission`, `calibre-web`, `freshrss`, `linkwarden`)
- Step-by-step **configuration tips** per service, including:
  - Wiring Sonarr/Radarr/Lidarr through Prowlarr and Transmission
  - Setting up Calibre + Calibre-Web with **Kobo sync** for eReaders
  - Integrating Soulseek via Slskd + Soularr for music
  - Using Copyparty as a lightweight file drop server

The goal is not just to run containers, but to have a **coherent home system** where each service has a clear job.

## What I Learned

- Designing **multi-service Docker stacks** that stay understandable over time
- Using tools like **Portainer** and **Traefik** to simplify day‑to‑day operations
- Applying **linting and Renovate** to infrastructure code, not just app code
- Documenting configuration in a way that future‑me (or someone else) can follow without digging through compose files

## Links

- Source and docs: https://github.com/sogladev/home-media-server
- Full service list, folder structure, and setup instructions: see the README in the repository
