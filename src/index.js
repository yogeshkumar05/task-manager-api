const express = require('express');
require('./db/mongoose');
const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const port = process.env.PORT;





/*
    without middleware: new request => run route handler
    with middleware: new request => do something => run route handler
*/
// middleware function example
// app.use((req, res, next)=>{
//     console.log('req.method', req.method);
//     console.log('req.path', req.path);
//     if(req.method === 'GET') {
//         res.status(404).send('Get requests are disabled');
//     } else {
//         next(); // letting know that the middleware is done
//     }
    
// });

// site is currently in maintenance. Try again later
// app.use((req, res, next) => {
//     res.status(503).send('Maintenance mode');
// });

app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

// const router = new express.Router();
// router.get('/test', (req, res) => {
//     res.send('Test router')
// });
// app.use(router);

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000 // 1 MB
//     },
//     fileFilter(req, file, cb) {
//         // if(!file.originalname.endsWith('.pdf')) {
//         if(!file.originalname.match(/\.(doc|docx)/)) {
//             return cb(new Error('File must be a word document'));
//         }

//         cb(undefined, true); // accept upload
//         // cb(undefined, true); // reject upload
//     } 
// });
// app.post('/upload', upload.single('uploadSingle'), (req, res) =>{
//     res.status(200).send('Uuploaded');

// })



const myFunction = async () => {
    const token = jwt.sign({_id: 'abc123'}, 'thisisnodemongocourse', {expiresIn: '7 days'});
    /*
        token is separated into three parts by .
        first part - base64 encided json string known as header - contains meta info about algo used
                    to generate token
        second part - known as payload/body
        third part - signature used to verify the token

    */
    console.log('token', token, token.length);
    const data = jwt.verify(token, 'thisisnodemongocourse');
    console.log('verify ', data);
}

myFunction();

app.listen(port, () => {
    console.log('Server started on port: ', port);
});

