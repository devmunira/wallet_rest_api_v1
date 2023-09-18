import supertest from 'supertest';
import app from './../../app.js'; 
import conectMongoDB from './../../config/db.js';
import Category from './../../model/Category.js';
import { createCategoryMock, updateCategoryMock } from './../mock/category.js'; 
import { TOKEN } from './../server.test.js'; 
import mongoose from 'mongoose';

beforeAll(async () => {
  await conectMongoDB('test');
});

describe('Category', () => {
  const dataTrack = [];

  describe('Create Category', () => {
    it('given valid request body should return 201 & create new category', async () => {
      const category = await Category.findOne({ name: createCategoryMock.name }).exec();
      const response = await supertest(app)
      .post('/api/v1/categories')
      .set('Authorization', TOKEN)
      .send(createCategoryMock);      
      if (category) {
        expect(response.status).toBe(400);  
      } else {
        console.log(response._body)
        dataTrack.push(response?._body?.data?._id);
        expect(response.status).toBe(201);
      }
    });
  });


  describe('GET All Category', () => {

    describe('given authorized header', () => {
      it('should return 200 response', async () => {
        const response = await supertest(app)
          .get('/api/v1/categories')
          .set('Authorization', TOKEN);
          expect(response.status).toBe(200);
      });
    });


    describe('given no authorized header', () => {
      it('should return 401 response', async () => {
        const response = await supertest(app)
          .get('/api/v1/categories')
          .set('Authorization', '');
          expect(response.status).toBe(401);
      });
    });
  });
  
  
  it('PUT Create or Update Category', async () => {
    const categoryId = new mongoose.Types.ObjectId().toString();
    const category = await Category.findById(categoryId);
    const Unique = await Category.findOne({name : updateCategoryMock.name}).exec();
    const response = await supertest(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set('Authorization', TOKEN)
      .send(updateCategoryMock);

    if (category) {
      expect(response.status).toBe(200);
    } else {
      if(!Unique){
        dataTrack.push(response._body.data._id);
        expect(response.status).toBe(201);
      }else{
        expect(response.status).toBe(400)
      }
    }
  });

  describe('Delete Category', () => {
    describe('given auth token', () => {
      it('Should Delete Category', async () => {
        const categoryId = new mongoose.Types.ObjectId().toString()
        const category = await Category.findById(categoryId);
        const response = await supertest(app)
          .delete(`/api/v1/categories/${categoryId}`)
          .set('Authorization', TOKEN);
        if (!category) {
          expect(response.status).toBe(404);
        } else {
          expect(response.status).toBe(204);
        }
      });
    });

    describe('given no auth token', () => {
      it('Should not Delete Category and thorw 401', async () => {
        const categoryId = new mongoose.Types.ObjectId().toString()
        const category = await Category.findById(categoryId);
        const response = await supertest(app)
          .delete(`/api/v1/categories/${categoryId}`)
          expect(response.status).toBe(401);
        
      });
    });
    
  });
  

  afterEach(async () => {
    dataTrack.forEach(async (itemId) => {
      await Category.findByIdAndDelete(itemId);
    });
  });
});

