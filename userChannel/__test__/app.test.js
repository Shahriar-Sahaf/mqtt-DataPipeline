require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const request = require('supertest');
const express = require('express');
const { userLogin } = require('../authservice/userAuth');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE, 
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

app.use(express.json());
app.post('/auth/login', userLogin);

afterAll(async () => {
    await pool.end();
});

describe('test POST /auth/login', () => {
    const testUser = {
        idNumber: 785236,
        password: "password123"
    };

    it('should create a new user and return a token on the first login', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.message).toBe('Login successful');
    });

    it('should log in an existing user and send a token again', async () => {
        
        await request(app).post('/auth/login').send(testUser);
        
        
        const res = await request(app)
            .post('/auth/login')
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it(' should return 401 for an existing user with the wrong password', async () => {
    
        await request(app).post('/auth/login').send(testUser);

        
        const res = await request(app)
            .post('/auth/login')
            .send({ idNumber: testUser.idNumber, password: "wrongpassword" });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it(' should return 400 if fields are missing', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('ID and password are required');
    });
});

