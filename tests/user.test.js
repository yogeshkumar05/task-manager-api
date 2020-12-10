const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { response } = require('../src/app');

const existingUserId = new mongoose.Types.ObjectId();
const existingUser = {
  _id: existingUserId,
  name: 'User1',
  email: 'User1@abc.com',
  password: 'User1#123',
  tokens: [
    {
      token: jwt.sign({ _id: existingUserId }, process.env.JWT_SECRET)
    }
  ]
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(existingUser).save();
});

test('Should signup a new user', async () => {

  //Assert the http response code
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Test1',
      email: 'test1@abc.com',
      password: 'Test1#123'
    })
    .expect(201);

  //Assert that the db was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assert the response body
  expect(response.body.user.name).toBe('Test1');

  // expect(response.body.user).toMatchObject({
  //     user: {
  //         name: 'Test1',
  //         email: 'test1@abc.com',
  //     },
  //     token: user.tokens[0].token
  // });
});

test('Should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'User1@abc.com',
      password: 'User1#123'
    })
    .expect(201);
})

test('Should not login invalid user', async () => {
  await request(app)
    .post('/users.login')
    .send({
      email: 'test',
      password: 'test'
    })
    .expect(404);
})

test('Should get current user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send()
    .expect(200);
})

test('Should not get details for unauthorized user', async () => {
  await request(app)
    .get('/users/mee')
    .send()
    .expect(404);
})

test('Should delete current user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send()
    .expect(201);
})

test('Should not delete unauthorized user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .send()
    .expect(201);
})