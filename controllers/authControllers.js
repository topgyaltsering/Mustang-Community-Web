const User = require('../models/User');

require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET;
var bcrypt = require('bcryptjs');




// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  console.log(err.message);

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// JWT: parameters -  (payload, secretOrPrivateKey, options => expiresIn)
//  payload contains that data we want to store in the cache 
//secretorPrivateKey : our secret key 
//7200 seconds  = 2 hours
// our secret key and the payload are combined and passed into the hashing algorithm which will generate a token for us
const createToken = (id)=>{

  return jwt.sign({id} , jwt_secret , {
    expiresIn: 2 * 60 * 60
  });
}




  

  module.exports.login_get = (req,res)=>{
      res.render('login');
  }

  module.exports.login_post = async (req,res)=>{
  
  console.log("req..body");
    console.log(req.body);

    const email = req.body.email;
    const password =req.body.password;


    



  try{
   const user = await User.loginUser(email,password);
   const token = createToken(user._id);
       //res.cookie(NAME, value , options)
       res.cookie('jwt',token,{
        httpOnly: true,
        expires: new Date(Date.now() + 7200000)  // 7,200,000ms = 120 min = 2 hours
       })
   res.status(200).json({ user: user._id });
  // res.redirect("/");

  //  res.render('register' , {
  //    user: user._id ,
  //  })
  }catch(err){
    const errors = handleErrors(err);
    res.status(400).json({ errors });}
   
  }

  module.exports.remove_all_docs = (req,res)=>{
    User.deleteMany({} , function(err){
      if(err){
        res.send(err);
      }
      
    });

  }

//expiresIn: expressed in seconds or a string describing a time span zeit/ms.




// (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.



  module.exports.register_get = (req,res)=>{
    res.render('register');
}

module.exports.register_post = async (req,res)=>{

   //need to handle errors ( minlength, duplicate email, etc)
     try {

    // const first = req.body.firstName;
    // const last = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

  const user =  await User.create({
  //  firstName : first,
  //  lastName : last ,
   email, password
   
       });
console.log("user.." , user);
       const token = createToken(user._id);
       //res.cookie(NAME, value , options)
       res.cookie('jwt',token,{
        httpOnly: true,
        expires: new Date(Date.now() + 7200000)  // 7,200,000ms = 120 min = 2 hours
       })

       res.json({ user: user._id }); // redirect to home page...
      // res.redirect("/"); // automatically log user in after they register...
      
      }
     catch(err) {
       const errors = handleErrors(err);
       res.status(400).json({ errors });
      }
    

}
