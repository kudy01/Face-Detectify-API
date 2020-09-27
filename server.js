const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex')

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = knex({
	client: 'pg',
  	connection: {
	    host : 'postgresql-contoured-33202',
	    user : 'kudy',
	    password : '',
	    database : 'face-detectify'
	}
});

app.use(cors())
app.use(express.json()); // as body is json

const bcrypt = require('bcrypt-nodejs')

app.get('/', (req, res) => { res.send('It is working')})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
	console.log(`App is running on port ${process.env.PORT}`); 
})

