const supertest = require("supertest");
import mongoose from "mongoose";
import User from "../../model/User.js";
import { TOKEN } from "../server.test.js";
import app from "./../../app.js"
import conectMongoDB from '../../config/db.js';



beforeAll(async () => {
    await conectMongoDB('test');
});

const createUser = {
    username : 'testOne',
    email : 'test@muniraakter.com',
    password : '200720Ab!',
    confirm_password : '200720Ab!'
}


const updateUser = {
    username : 'oneUser',
    email : 'userOne@gmail.com',
    password : '200720Ab!',
    confirm_password : '200720Ab!'
}


const createInvalidUser = {
    username : 'testUserTwo',
    email : 'uniraakter.com',
    password : '200720Ab!',
    confirm_password : '200720Ac!'
}

describe('User', () => {
   let dataTrack = [];
    describe('User Create', () => {
        describe('given invalid argument', () => {
            it('should return 400 error', async () => {
                const response = await supertest(app).post('/api/v1/users')
                .set('Authorization' , TOKEN)
                .send(createInvalidUser);
                expect(response.status).toBe(400)
            });  
        });

        describe('given no Authozization Token', () => {
           it('should return 401 error', async () => {
                const response = await supertest(app).post('/api/v1/users')
                .send({username : 'test' , email : 'test@gamil.com'});
                expect(response.status).toBe(401)
           });
            
        });
        
    });

    describe('Get All User', () => {
        describe('given valid params and auth token', () => {
            it('should return 200', async () => {
                const users = await supertest(app)
                .get('/api/v1/users')
                .set('Authorization' , TOKEN)
                expect(users.status).toBe(200)
                expect(users._body).toHaveProperty('data')
            });  
        });
    });


    describe('Get Single User', () => {
        describe('given valid id params and auth token', () => {
            it('should return 200', async () => {
                const user =  await User.findOne({}).exec();
                const users = await supertest(app)
                .get(`/api/v1/users/${user._id}`)
                .set('Authorization' , TOKEN)
                expect(users.status).toBe(200)
                expect(users._body).toHaveProperty('data')
            });  
        });
    });


    describe('Get Single User', () => {
        describe('given valid id params and auth token', () => {
            it('should return 200', async () => {
                const user =  await User.findOne({}).exec();
                const users = await supertest(app)
                .get(`/api/v1/users/${user._id}`)
                .set('Authorization' , TOKEN)
                expect(users.status).toBe(200)
                expect(users._body).toHaveProperty('data')
            });  
        });
    });


    describe('Delete User', () => {
        it('Should Delete User', async () => {
            const userId = new mongoose.Types.ObjectId().toString()
            const user = await User.findById(userId);
            const response = await supertest(app)
                .delete(`/api/v1/users/${userId}`)
                .set('Authorization', TOKEN);
            if (!user) {
                expect(response.status).toBe(500);
            } else {
                expect(response.status).toBe(204);
            }  
        });
    });


    describe('User Update By Put', () => {
        describe('given exits Id params', () => {
            it('should return updated Users with 200', async () => {
                const userId = await User.findOne({}).exec()
                const users = await supertest(app)
                .put(`/api/v1/users/${userId._id}`)
                .set('Authorization' , TOKEN)
                .send(updateUser)
                expect(users.status).toBe(200)
                expect(users._body).toHaveProperty('data')
            }); 
        });     
    });



    describe('User Update By Patch', () => {
        describe('given exits Id params', () => {
            it('should return updated Users with 200', async () => {
                const userId = await User.findOne({}).exec()
                const users = await supertest(app)
                .put(`/api/v1/users/${userId._id}`)
                .set('Authorization' , TOKEN)
                .send(updateUser)
                expect(users.status).toBe(200)
                expect(users._body).toHaveProperty('data')
            });
        });     
    });
    
    
    
    


    afterEach(async () => {
        dataTrack.forEach(async (itemId) => {
            await User.findByIdAndDelete(itemId);
          });
    })
    
});
