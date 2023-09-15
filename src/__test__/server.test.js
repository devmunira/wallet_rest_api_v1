import dotenv from 'dotenv';
import app from "./../app.js"
import supertest from 'supertest';
import colors from "colors"
import conectMongoDB from './../config/db.js';
import mongoose from 'mongoose';
dotenv.config();
const PORT = process.env.SERVER_PORT || 4000;

export const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA0M2U4ZWY1MWNjNjkyODQwNjY1NjgiLCJ1c2VybmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlSWQiOiI2NTA0M2U4ZWY1MWNjNjkyODQwNjY1MWEiLCJjcmVhdGVkQXQiOiIyMDIzLTA5LTE1VDExOjIyOjU0Ljc3OVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA5LTE1VDExOjIyOjU0Ljc3OVoiLCJpc3N1ZWRJcCI6IjE5Mi4xNjguMC4xMDIiLCJpYXQiOjE2OTQ3NzcxMTgsImV4cCI6MTY5NDgyMDMxOH0.FxqK6Mh0JuGi4j9XdhgbinJDyDVjZe-OmMygD72YqS8`


beforeAll(async () => {
	await conectMongoDB('test')
	.then(() => {
		app.listen(PORT, () => {
		console.log(`SERVER IS LISTENING ON PORT ${PORT}`.green);
		});
	})
	.catch((err) => console.log(err.message.red));
});


// Health Route Test
describe('GET /health', () => {
  it('responds with status 200 and a health message', async () => {
    const response = await supertest(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: 'API Health is ok!',
    });
  });
});

// Category Routes Test
describe('Category', () => {
  it('GET All Category', async () => {
      const response = await supertest(app)
      .get('/api/v1/categories')
      .set('Authorization', TOKEN)
       expect(response.status).toBe(200)
  });

  it('POST Create Category', async () => {
     const response = await supertest(app)
    .post('/api/v1/categories')
    .set('Authorization', TOKEN)
    .send({name : 'test'})
     expect(response.status).toBe(201)
  });

  // it('PUT Create or Update Category', () => {
      
  // });

  // it('DELETE Delete Category', () => {
      
  // });
});

// import Category from "./intrigate/sd.js"



