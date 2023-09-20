import dotenv from 'dotenv';
import app from "./../app.js"
import supertest from 'supertest';
import colors from "colors"
dotenv.config();
const PORT = process.env.SERVER_PORT || 4000;
import conectMongoDB from './../config/db.js';

export const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBhYTU3ZTNlOGQ1NDhiNmRkNGYzODIiLCJ1c2VybmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlSWQiOiI2NTBhYTU3ZTNlOGQ1NDhiNmRkNGYzMzYiLCJjcmVhdGVkQXQiOiIyMDIzLTA5LTIwVDA3OjU1OjQyLjM0N1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTA5LTIwVDA3OjU1OjQyLjM0N1oiLCJpc3N1ZWRJcCI6IjE5Mi4xNjguMC4xMDIiLCJpYXQiOjE2OTUxOTY2MDAsImV4cCI6MTY5Nzc4ODYwMH0.031fmCVaQLB67i3uMAZC0gvOAU5rkB1aPxYEZbKcaXo`



beforeAll(async () => {
  await conectMongoDB('test');
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

import CategoryTest from "./intrigate/category.test.js"
import AccountTest from "./intrigate/account.test.js"
import ExpanseTest from "./intrigate/expanse.test.js"
import IncomeTest from "./intrigate/income.test.js"
import UserTest from "./intrigate/user.test.js"
import PermissionTest from "./intrigate/permission.test.js"

