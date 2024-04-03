const express = require('express');
//const Joi=require('joi');
const app = express();
app.use(express.json())
const port = 3000;

const cors = require('cors')
const corsOrigin ={
  origin:null, //or whatever port your frontend is using
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));

let users=[
  {
    "firstName":"John",
    "lastName":"Omwoyo",
    "dateOfBirth":"10-12-2011",
    "email":"Johnsonomwoyon@gmail.com",
    "password":2000000,
    "termAndConditions":true
}
]
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});    

app.post('/Login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
 const user=req.body;
  
    if(user.password==null||user.password==""||user.email==null||user.email==""){
      res.status(401);
      res.json({
"message":"Incorrect username or password"
      });
    }
    
   let client= users.find(u=>u.email==user.email);
    if(!client){
      res.status(401);
      res.json({
        "message":"Incorrect username or password"
      });
      
    }
    else if(user.password==client.password){
     
      res.json({
        "message":"Login successful"
      });
    
        
    }
    else{
      res.status(401);
      res.json({
       "message":"Incorrect username or password" 
      });
    }
  

 }); 



app.get('/users/', (req, res) => {
  var email=req.query.email;
  if (email!=null){
    res.json(users.filter(user=>user.email==email));
  }
  else{
    res.json(users);
  }
    
  });        
  app.post('/users', (req, res) => {
    
   var user=req.body;
let validationRes=validate(user);
if(validationRes !== "")
{
  res.status(400);
  res.json({
    'message':validationRes
  });
  return
}
   const { email } = user;
   let checkEm=users.find(user=>user.email===email);
   
    
    if(checkEm){
      res.status(400);
      res.json({
        'message':'Email already exists'
      });
    }
    
    else
    {
    
    users.push (user);
      res.json(user);
    }
  }); 

  
  
  
    app.put('/users/', (req, res) => {
      
      const { email } = req.body;
      
      let checkEm=users.find(user=>user.email===email);
      var user =req.body;

      let validationRes=validatep(user);
      if(validationRes!==""){
        res.json({'message':validationRes
              } );
      }
      if(!checkEm){
       
        res.json({
          "message":"Invalid Details"
        });
      }
    
      else{
       let index= users.findIndex(user=>user.email===email);

      users[index].firstName=user.firstName; 
      users[index].lastName=user.lastName;
      users[index].email=user.email;  
      users[index].password=user.password;
     
    }
    res.send(user);
    
  

  });        
  function validate(user){
   
   let result=""; 
    if(user.email==null||user.email.trim()===""){
 result+=' email is required';
    }
    else{
      var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
      if(!user.email.match(validRegex)){
        result+=' invalid email';
        
      } 
      
    }
    if(user.firstName==null||user.firstName.trim()===""||user.firstName==""){
      result+=' Firstname required';
    }
    else{
      if(user.firstName.length<3){
        result+=" Firstname too short";
      }
    }
    
    
    if(user.lastName==null||user.lastName.trim()===""||user.lastName==""){
      result+=(result!==""?", ":"")+'Lastname required';
    }  
    else if(user.lastName.length<3){
      //if(result!==""){result+=", ";}
        result+=(result!==""?", ":"")+"lastname too short";
      }
    if (user.password==null||user.password.trim()===""||user.password==""){
      result+=' Enter your password';
    }
    if (user.dateOfBirth==null||user.dateOfBirth==""){
      result+='Date of birth is required';
    }
     
    return result;
  }



  function validatep(user){
   
    let result=""; 
     if(user.email==null||user.email.trim()===""){
  result+='email is required';
     }
     else{
       var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
       if(!user.email.match(validRegex)){
         result+='invalid email';
         
       } 
       
     }
     
       
       if(user.firstName!==null||user.firstName.trim()===""){
        if(user.lastName.length<3)
        { result+="firstname too short";}
        if(user.lastname=='')
        {result+="firstname Required"}
       }
       
     
     
     
     
       if(user.lastName!==null||user.lastName.trim()===""){
        if(user.lastName.length<3)
        { result+="lastname too short";}
        if(user.lastname=='')
        {result+="Lastname Required"}
       }
      
      return result;
  }

                      