## The Demo Project

A demo project to practice javascript, node.js, express, and React.js.

The project contains a frontend app (React.js) and a backend API server (node.js, express, postgresql).

### How to get started

#### Start the Backend

**Prerequisite : the backend runs on top of a PostgreSQL database. PostgreSQL must be installed**

To initialize the backend environment and subsequently run the backend if required, please run the command below using the Microsoft Windows  command terminal :
```bash
cd backend
call install.bat
```

Note this script  above runs only on Microsoft Windows.
The script will:
- Install npm dependencies
- Request the Postgres admin password
- Drop the Postgress database demo if it exists
- Drop the database user demo if it exists
- Create database user demo
- Creating database demo
- Load database schema
- Seed the database
- Launch the backend if needed

If the script above cannot be run (e.g . the platform is not Windows), you can manually perform the initialization using the following commands  instead:
```bash
cd backend
npm install
psql -U postgres -c "DROP DATABASE IF EXISTS demo;"
psql -U postgres -c "DROP ROLE IF EXISTS demo;"
psql -U postgres -c "CREATE USER demo WITH PASSWORD 'demo';"
psql -U postgres -c "CREATE DATABASE demo OWNER demo;"
tsx data/schema.ts
tsx data/seed.ts
```

To simply launch the backend after **the initialization above is complete**,
please go to the directory where the backend index.js is stored
and then run :
```bash
cd backend
tsx index.js
```

By default, the backend listens on port 3000.
Swagger is at : http://localhost:3000/api-docs

Note this backend was tested on Windows 11 and with :
* npm :  version 10.9.0
* tsx :  version  4.19.2
* node : version 22.9.0
* psql :  17.2


#### Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Connect your browser to http://localhost:5173
# Type CONTROL C to stop the server
```