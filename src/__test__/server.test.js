import dotenv from 'dotenv';
import app from "./../app.js"
import supertest from 'supertest';
import colors from "colors"
dotenv.config();
const PORT = process.env.SERVER_PORT || 4000;

export const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA0M2U4ZWY1MWNjNjkyODQwNjY1NjgiLCJ1c2VybmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlSWQiOiI2NTA0M2U4ZWY1MWNjNjkyODQwNjY1MWEiLCJjcmVhdGVkQXQiOiIyMDIzLTA5LTE1VDExOjIyOjU0Ljc3OVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA5LTE3VDA5OjE4OjA1LjAwOVoiLCJpc3N1ZWRJcCI6IjE5Mi4xNjguMC4xMDUiLCJpYXQiOjE2OTQ5OTgzMjUsImV4cCI6MTY5NTA0MTUyNX0.PCLwY7bgQ8hfPXHFsvw3H5Zubkpx9KsFkpdNnyJEYhM`


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


import CategoryTest from "./intrigate/category.test.js"
// import AccountTest from "./intrigate/account.tests.js"
import PermissionTest from "./intrigate/permission.test.js"



