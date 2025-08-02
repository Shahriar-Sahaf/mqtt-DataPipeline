require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});
const {Pool} = require('pg')

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})

async function createUserTable() {

    try {
        const query =`
        CREATE TABLE IF NOT EXISTS userss (
            id SERIAL PRIMARY KEY,
            number VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        await pool.query(query)
    } catch (error) {
        console.error('Error creating user table:', error)
        throw error;
    }
}

async function createUser(password,number) {
    try {
        const query = `
        INSERT INTO userss (password,number)
        VALUES ($1,$2)
        RETURNING id
        `
        const values = [password,number]
        await pool.query(query, values)
        console.log('User created')
    } catch (error) {
        console.error('Error creating user:', error)
        throw error;
    }
}


async function getUserById(idNumber) {
    try {
        const query = `SELECT * FROM userss WHERE number = $1`;
        const result = await pool.query(query, [idNumber]);

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}
module.exports = {createUserTable,createUser,getUserById}