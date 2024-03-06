const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port || 8000;
const login_route = require('./Routes/login');
const signup_route = require('./Routes/signup');
const profileimage_route = require('./Routes/profileImage');
const users_route = require('./Routes/users');
const activity_route = require('./Routes/useractivity');
app.use(express.json());
app.use(cors());

app.use('/login',login_route);
app.use('/signup',signup_route);
app.use('/profileimage',profileimage_route);
app.use('/users',users_route);
app.use('/activity',activity_route);


app.listen(port,()=>{console.log("server is running");})