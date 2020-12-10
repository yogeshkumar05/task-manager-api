const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');


const router = new express.Router();

router.get('/test', (req, res) => {
  res.send('Test router')
});



// create user
router.post('/users', async (req, res) => {

  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});


router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(401).send(e);
  }
});


router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send('Error loggin out');
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send('Error loggin out');
  }
});

// run the middleware before running the route handler
router.get('/users', auth, async (req, res) => {

  try {
    const users = await User.find({});
    res.status(200).send(users);

  } catch (e) {
    res.status(500).send(e);
  }

});

router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user);
});

// update user
router.patch('/users/me', auth, async (req, res) => {
  const newUpdates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = newUpdates.every((operation) => allowedUpdates.includes(operation));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid operation' });
  }

  try {
    // this doesn't run the middleware
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true});

    // for the middleware to run
    const { user } = req;
    newUpdates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    res.status(200).send(user);

  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000 // 1 MB
  },
  fileFilter(req, file, cb) {
    // if(!file.originalname.endsWith('.pdf')) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)/)) {
      return cb(new Error('File must be an image'));
    }

    cb(undefined, true); // accept upload
    // cb(undefined, true); // reject upload
  }
});


router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error('Not found');
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);

  } catch (e) {
    res.status(404).send(e);
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send('Uploaded avatar');
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send('Deleted avatar');
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    sendCancellationEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.status(201).send(req.user);
  } catch (e) {
    // console.log(e);
    res.status(500).send(e);
  }
})


module.exports = router;