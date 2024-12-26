## The Demo Project

A demo project to practice javascript, node.js, express, and React.js.

The project contains a frontend app (React.js) and a backend API server (node.js, express, postgresql).

### How to get started

#### Create a postgresql user and database

```bash
> sudo -u postgres psql
#  create user demo with password 'demo';
#  create database demo owner demo;
# \q
```

#### Create the database schema (tables)

```bash
> cd backend 
> npm run schema
```

#### Seed the database with some data (users, books...)

```bash
> cd backend
> npm run seed
```

#### Start the backend API server

```bash
> cd backend

> npm run dev

# Check API server is running on port 3000
> curl localhost:3000
  {"status": 200, "message": "API server OK"}
# Type CONTROL C to stop the server
```

#### Start the frontend

```bash
> cd frontend
> npm run dev
# Connect your browser to http://localhost:5173
# Type CONTROL C to stop the server
```