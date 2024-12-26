## The Demo Project

A demo project to practice javascript, node.js, express, and React.js.

The project contains a frontend app (React.js) and a backend API server (node.js, express, postgresql).

### How to get started

#### Start the Backend

To initialize the backend environment and subsequently run the backend if required, please run the command below using the Microsoft Windows  command terminal :
```bash
> cd backend
> call install.bat
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

To simply launch the backend after **initialization is complete**,
please go to the directory where the backend index.js is stored
and then run :
```bash
> cd backend
> tsx index.js
```

By default, the backend listens on port 3000


#### Start the Frontend

```bash
> cd frontend
> npm run dev
# Connect your browser to http://localhost:5173
# Type CONTROL C to stop the server
```