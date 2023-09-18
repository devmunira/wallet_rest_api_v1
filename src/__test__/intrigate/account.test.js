import supertest from 'supertest';
import app from '../../app.js'; 
import conectMongoDB from '../../config/db.js';
import Account from '../../model/Account.js';
import { createInvalidAccountMock, createValidAccountMock, updateValidAccountMock } from '../mock/account.js'; 
import { TOKEN } from '../server.test.js'; 
import User from '../../model/User.js';

beforeAll(async () => {
  await conectMongoDB('test');
});

describe('Account', () => {
  const dataTrack = [];

  // Get All Account
  it('GET All Account with Authorization Header should return 200 response', async () => {
    const response = await supertest(app)
      .get('/api/v1/accounts')
      .set('Authorization', TOKEN);
      expect(response.status).toBe(200);
  });

  it('GET All Account without Authorization Header should return 401 response', async () => {
    const response = await supertest(app)
      .get('/api/v1/accounts')
      expect(response.status).toBe(401);
  });

  it('POST Create Account', async () => {
    const account = await Account.findOne({ name: createValidAccountMock.name });
    const user = await User.findById(createValidAccountMock.userId);
    const response = await supertest(app)
      .post('/api/v1/accounts')
      .set('Authorization', TOKEN)
      .send(createValidAccountMock);

    if(!user){
      expect(response.status).toBe(404);
    }else{
      if (account) {
        expect(response.status).toBe(400);
      } else {
        dataTrack.push(response._body.data._id);
        expect(response.status).toBe(201);
      }
    }
  });

  it.only('PUT Create or Update Account', async () => {
    const accountId = '65043e8ef51cc6928406655c';
    const account = await Account.findById(accountId);
    const Unique = await Account.findOne({name : updateValidAccountMock.name}).exec()
    const user = await User.findById(updateValidAccountMock.userId);
    const response = await supertest(app)
      .put(`/api/v1/accounts/${accountId}`)
      .set('Authorization', TOKEN)
      .send(updateValidAccountMock);
      if(!user){
        expect(response.status).toBe(404);
      }else{
        if (account) {
          expect(response.status).toBe(200);
        } else {
           if(!Unique){
              dataTrack.push(response._body.data._id);
              expect(response.status).toBe(201);
           }else{
            expect(response.status).toBe(400)
           }
        }
      }
  });

  it('DELETE Delete Account', async () => {
    const accountId = '65043e8ef51cc6928406655c';
    const account = await Account.findById(accountId);
    const response = await supertest(app)
      .delete(`/api/v1/accounts/${accountId}`)
      .set('Authorization', TOKEN);
    if (!account) {
      expect(response.status).toBe(404);
    } else {
      expect(response.status).toBe(204);
    }
  });

  afterEach(async () => {
    // Clean up data created during the test by deleting the accounts
    dataTrack.forEach(async (itemId) => {
      await Account.findByIdAndDelete(itemId);
    });
  });
});
