To initialize the backend environment and subsequently run the backend if required, please run the command below using the Microsoft Windows  command terminal :
- call install.bat

Note this script  above runs only on Microsoft Windows
THe script will 

- Install npm dependencies
- Request the Postgres admin password
- Drop the Postgress database demo if it exists
- Drop the database user demo if it exists
- Create database user demo
- Creating database demo 
- Load database schema
- Seed the database
- Launch the backend if needed

To simply launch the backend after initialization, 
please go to the directory where the backend index.js is stored 
and then run :   
- tsx index.js

By default, the backend listens on port 3000
