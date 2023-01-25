var express = require('express');
require('dotenv').config();
var router = express.Router();
var mongoose = require('mongoose');
var User=require('../models/user')

var cors=require('cors');
var app = express();
var mongoURI = process.env.MONGO_URI;
app.use(cors());

// Replace this url with your MongoDB url
mongoose.connect(mongoURI, 
	{
		useNewUrlParser: true,
		// useCreateIndex : true,
    // useUnifiedTopology: true	
  }
).then(
	function (){
		console.log('Connected to DB');
	}
).catch(
	function (err) {
		console.log(err);
	}
);

router.get('/users',function(req,res){
  User.find({}).then(users=>{ 
    res.send(users);
  }).catch(err=>{
    console.log(err);
    res.send(null);
  });
});


router.get('/userById/:id',function(req,res){
  User.findOne({_id:req.params.id}).then(user=>{
    res.send(user);
  }).catch(err=>{
    console.log(err)
    res.send(null);
  });
})

router.post('/addUser',function(req,res){
  const user = req.body.user;
  if(user){
    User.find({email:user.email}).then(searchResult => {
      if (searchResult && searchResult.length > 0){
          res.send({
            status:false,
            message:"That email has already been taken!"
        });
      } else {
        var newUser = new User({
          firstName : user.firstName, 
          lastName : user.lastName,
          gender: user.gender,
          email: user.email,
          password: user.password,
          address: user.address,
          profession: user.profession 
        });
        newUser.save().then(()=>{
            res.send({
              status:true,
              message:'User added successfully!'
            })
        }).catch(err => {
          console.log(err);
            res.send({
              status:false,
              message:'Failed to add user!'
            })
        })
      }
    }).catch(err => {
      console.log(err);
      res.send({
        status: false,
        message: "Failed to add user!"
      });
    });
  }else{
    res.send({
      status: false,
      message: 'Invalid parameter'
    });
  }
});



router.post("/editUser/:id",function(req,res){
  const user = req.body.user;
  const id = req.params.id;
  console.log(user);
  User.findByIdAndUpdate(id, {
    firstName : user.firstName,
    lastName: user.lastName,
    password: user.password,
    address: user.address,
    gender: user.gender,
    profession: user.profession
  }).then(()=> {
    res.send({
      status: true,
      message: "User updated successfully!"
    });
  }).catch(err => {
    console.log(err);
    res.send({
      status: false,
      message: "Failed to update user!"
    })
  });


})

router.post("/deleteUser",function(req,res){
  User.findOneAndDelete({_id : req.body.id}).then((user)=>{
    if(user){
      res.send({
        status:true,
        message:'User deleted!'
      })
    }else{
      res.send({
        status:false,
        message:'No user with given id found!'
      })
    }
  }).catch(err => {
    console.log(err);
      res.send({
        status:false,
        message:'Failed to delete user!'
      })
  });
})


module.exports = router;
