import pg from "pg"

const { Pool } = pg

const dbConfig = {
	user: 'demo',
	password: 'demo',
	host: 'localhost',
	port: '5432',
	database: 'demo'
}

const pool = new Pool(dbConfig)

export default pool