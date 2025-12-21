---
title: "Building Web APIs with Rust"
description: "Learn how to build fast and reliable web APIs using Rust and Axum framework."
tags: ["rust", "backend", "api"]
date: 2025-01-05
author: "Your Name"
---

# Building Web APIs with Rust

Rust is becoming increasingly popular for building high-performance web services. Let's explore how to build a REST API with Axum.

## Why Rust for Web Development?

- **Performance**: Comparable to C/C++
- **Safety**: Memory safety without garbage collection
- **Concurrency**: Fearless concurrency model
- **Tooling**: Excellent package manager (Cargo)

## Setting Up Axum

First, add dependencies to your `Cargo.toml`:

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

## Basic Server

```rust
use axum::{
    routing::{get, post},
    Router,
    Json,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
}

async fn get_user() -> Json<User> {
    Json(User {
        id: 1,
        name: "Alice".to_string(),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/user", get(get_user));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
```

## Database Integration

```rust
use sqlx::PgPool;

async fn connect_db() -> PgPool {
    PgPool::connect("postgresql://user:password@localhost/mydb")
        .await
        .expect("Failed to connect to database")
}
```

## Conclusion

Rust provides excellent performance and safety guarantees for web development, making it a great choice for production APIs.
