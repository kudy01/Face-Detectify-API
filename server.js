const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json()); // as body is json

const bcrypt = require('bcrypt-nodejs')

const database ={ 
	users: [
	{
		id: '123',
		name: 'John',
		email: 'john@gmail.com',
		password: 'cookies',
		entries: 0,
		joined: new Date()

	},
	{
		id: '124',
		name: 'sally',
		email: 'sally@gmail.com',
		password: 'bananas',
		entries: 0,
		joined: new Date()

	}
],
login :[

	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) =>{
	// Load hash from your password DB.
	bcrypt.compare("apples", '$2a$10$Fiadid4oeTMCmerLPu6J2.3KQf1xaG6ZFzANibdGn62IX1irvHPC2', function(err, res) {
	    console.log('first guess', res)
	});
	bcrypt.compare("veggies", '$2a$10$Fiadid4oeTMCmerLPu6J2.3KQf1xaG6ZFzANibdGn62IX1irvHPC2', function(err, res) {
	    console.log('second guess', res)
	});
	if(req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password){
		res.json(database.users[0])
	}
	else {
		res.status(400).json('error logging in')
	}
})

app.post('/register', (req, res) =>{
	const {email, name, password} = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    	console.log(hash)
	});
	database.users.push({
		
			id: '125',
			name: name,
			email: email,
			entries: 0,
			joined: new Date()

		})
	res.json(database.users[database.users.length-1])
	})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach( user => {
		if(user.id === id) {
			return res.json(user);
			found = true;
		}
	})
	if(!found) {
		res.status(404).json("no such user")
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach( user => {
		if(user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!found) {
		res.status(404).json("no such user")
	}
})









app.listen(3000, ()=> {
	console.log('App is running on port 3000'); 
})







/*
 / ---> GET = this is working
 /signin ---> POST = sucess or fail // because we want to send password
 /register --->  POST = return the new created user
 /profile/userid: ---> GET = user
 /image --> PUT = to update the number of pictures submitted
*/