


const handleProfileGet = (req, res, db) => {
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
}


module.exports = {
	handleProfileGet // ES6 dont need value 
};