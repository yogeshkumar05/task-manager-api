const mongoose = require('mongoose');

// const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';
const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL, {useNewUrlParser: true, useCreateIndex: true});

// // 1. Define a model
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         required: true,
//         default: 0,
//         validate(value) {
//             if(value < 0) {
//                 throw new Error('Age must be greater than 0')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if(value.length<6) {
//                 throw new Error('Password must be greater than 6 characters');
//             } else if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password should not be equal to password');
//             }
//         }
//     }
// }); //

// // 2. Create an instance of the model
// const user1 = new User(
//     {
//         name: 'User1', 
//         age: 20, 
//         email: 'test@abc.com',
//         password: 'test123'
//     }
// ); // instance of model

// // 3. Save model instance to the DB
// // user1.save()
// // .then((result)=> {
// //     console.log('Success', result);
// // })
// // .catch((error) => {
// //     console.log('Error', error);
// // });


// const Task = mongoose.model('Tasks', {
//     description:{
//         type: String,
//         require: true,
//         trim: true
//     },
//     completed:{
//         type: Boolean,
//         required: false,
//         default: false
//     }
// });

// const task1 = new Task({description: 'Task 1  '});
// task1.save()
// .then((result)=> {
//     console.log('Success', result);
// })
// .catch((error) => {
//     console.log('Error', error);
// });

