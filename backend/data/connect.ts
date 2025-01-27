
// Had to amend the import for the unitary tests to work
// for more detail, see : https://stackoverflow.com/questions/71055340/getting-undefined-import-of-postgres-in-jest
// previous import was : import pg from "pg"
// pg used to manage psql database
import * as pg from 'pg';

const { Pool } = pg

// db and credentials
const dbConfig = {
	user: 'demo',
	password: 'demo',
	host: 'localhost',
	port: '5432',
	database: 'demo'
}

const pool = new Pool(dbConfig)

export default pool
