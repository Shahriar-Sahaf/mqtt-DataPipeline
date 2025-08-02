
const {Pool} =require('pg');

const pool  = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

async function createTable(){
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS deviceName (
            id SERIAL PRIMARY KEY,
            device INTEGER NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
        await pool.query(query);
        console.log('Postgres table created successfully');

    } catch (error) {
        console.error('Database connection error:', error);
    }

}

async function saveToPostgres(data){

    try {
        const query =`INSERT INTO deviceName (device) VALUES ($1)`;
        const value = [data.device]

        await pool.query(query,value)

        console.log('Device serial Save to PostgreSQL')
    } catch (error) {
        console.log('Error saving to postgres:', error);
        throw error
    }
}


module.exports= {saveToPostgres,createTable}