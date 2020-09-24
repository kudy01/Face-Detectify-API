const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex')

const db = knex({
	client: 'pg',
  	connection: {
	    host : '127.0.0.1',
	    user : 'kudy',
	    password : '',
	    database : 'face-detectify'
	}
});

app.use(cors())
app.use(express.json()); // as body is json

const bcrypt = require('bcrypt-nodejs')


// app.get('/', (req, res) => {
// 	res.send(database.users);
// })

app.post('/signin', (req, res) =>{
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get User'))
			}
			else{
				res.status(400).json('Invalid Email or Password')
			}
		})
		.catch(err => res.status(400).json('Invalid Email or Password'))
})

app.post('/register', (req, res) =>{
	const {email, name, password} = req.body;
	const hash = bcrypt.hashSync(password);
		// starting a transaction as we are doing more than two things
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0])
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id: id})
		.then(user =>{
			if(user.length){
				res.json(user[0]);
			}
			else{
				res.status(400).json('No Such User Found');
			}
		})
		.catch(err => res.status(400).json('Error Getting the User'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries=>{
		res.json(entries[0])
	})
	.catch(err => res.status(400).json('Unable to get entries'))
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