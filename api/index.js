const express = require('express');
//const Joi=require('joi');
const app = express();
app.use(express.json())
const port = 3000;
app.use(express.static('../frontend'));
const path = require('path');
var mysql = require('mysql2');
var dateFormat = require('dateformat');
dbConnection = require('./db_connection.js');
//import dateFormat, { masks } from "dateformat";

const cors = require('cors')
const corsOrigin = {
  origin: 3000, //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOrigin));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "johnson",
  database: "test"

});
let users = [
  {
    "ID": "6",
    "firstName": "Johns",
    "lastName": "Omboga",
    "dateOfBirth": "10-12-2011",
    "email": "Jhnson@gmail.com",
    "password": "222",

    "termAndConditions": true

  }

]


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//registration post APi
app.post('/Registration', (req, res) => {
  const user = req.body;
  const { id, firstName, lastName, dateOfBirth, email, password, termsAndCondition } = req.body
  let validationRes = validate(user);
  if (validationRes !== "") {
    res.status(400);
    res.json({
      'message': validationRes
    });
    return
  }

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    emchecker = "SELECT * FROM users WHERE email=?;"
    con.query(emchecker, [email], function (err, result, fields) {

      if (err) throw err;
      if (result.length > 0) {
        res.status(400);
        res.json({
          'message': 'Email already exists'
        });

        return
      }

      else {


        con.connect(function (err) {
          if (err) throw err;
          console.log("Connected!");
          us = "INSERT into users VALUES(?,?,?,?,?,?,?);"
          con.query(us, [id, firstName, lastName, dateOfBirth, email, password, termsAndCondition], function (err, result, fields) {

            if (err) throw err;

            res.send({ message: 'Data inserted' });
            console.log(termsAndCondition);
          });
        });


      }

    });

  });
});



//this is a login post API
app.post('/Login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const user = req.body;
  const { email, password } = req.body;

  if (user.password == null || user.password == "" || user.email == null || user.email == "") {
    res.status(401);
    res.json({
      "message": "Incorrect username or password1"
    });
  }


  emchecker = "SELECT * FROM users WHERE email=?;"
  dbConnection.query(emchecker, [email], function (err, result, fields) {

    if (err) throw err;
    let u = result[0];
    //if (result.length > 0) {

    // console.log(u["passCode"])
    if (user.password !== u["passCode"]) {
      res.status(401);

      res.json({
        message: "Incorrect email or password"
      });
      return
    }
    //}
    else if (user.password === u["passCode"]) {
      let userDetails = {
        "email": u["email"],
        "firstName": u["firstName"],
        "lastName": u["lastName"]

      };
      // console.log(userDetails);
      // window.location.href = "users.html";
      res.json({ message: "Login succesful", data: userDetails })
    }

    else {
      res.json({ message: "Error fetching data please try again" })

    }
  });

});



app.get('/users/', (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT ID,firstName,lastName,dateOfBirth,email,termsAndConditions FROM users", function (err, result, fields) {
      if (err) throw err;
      for (i = 0; i < result.length; i++) {
        result[i]["dateOfBirth"] = dateFormat(result[i]["dateOfBirth"], "yyyy-mm-dd")


      }
      res.json(result);

    });
  });

  return;
  var email = req.query.email;
  if (email != null) {
    res.json(users.filter(user => user.email == email));
  }
  else {
    res.json(users);
  }

});
app.post('/users', (req, res) => {

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    sq = "INSERT into users VALUES(4,'kol','klaren','2002-01-04','Klaren@gmail.com','123211',0)"

    con.query(sq, function (err, result, fields) {

      if (err) throw err;
      res.json(result);

    });
  });

  let validationRes = validate(user);
  if (validationRes !== "") {
    res.status(400);
    res.json({
      'message': validationRes
    });
    return
  }

  const { email } = user;
  let checkEm = users.find(user => user.email === email);


  if (checkEm) {
    res.status(400);
    res.json({
      'message': 'Email already exists'
    });
  }

  else {

    users.push(user);
    res.json(user);
  }
});


app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/login.html'));
});

app.get('/Registration', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/Registration.html'));
});


app.put('/users', (req, res) => {
  let user = req.body;
  const { firstName, lastName, dateOfBirth, email } = req.body;

  let validationRes = validatep(user);
  if (validationRes !== "") {
    res.json({
      'message': validationRes
    });

    return;
  }


  else {
    let index = users.findIndex(user => user.email === email);
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      s = "SELECT ID FROM users WHERE email=?"

      con.query(s, [email], function (err, IDresult, fields) {

        if (err) throw err;
        if (IDresult.length === 0) {
          return res.json({
            message: "Invalid details"
          });
        }
        let d = IDresult[0]["ID"]




        console.log("Connected!");
        sq = "UPDATE users SET firstName=?,lastName=?,dateOfBirth=? WHERE ID=?"

        con.query(sq, [firstName, lastName, dateOfBirth, d], function (err, result, fields) {

          if (err) throw err;
          res.json(result);

        });
      });
    });


  }

});
function validate(user) {

  let result = "";
  if (user.email == null || user.email.trim() === "") {
    result += ' Email is required';
  }
  else {
    var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    if (!user.email.match(validRegex)) {
      result += (result !== '' ? ", " : "") + 'Invalid email';

    }

  }
  if (user.firstName == null || user.firstName.trim() === "" || user.firstName == "") {
    result += (result !== '' ? ", " : "") + 'First name is required';
  }
  else {
    if (user.firstName.length < 3) {
      result += (result !== '' ? ", " : "") + 'First name too short';
    }
  }


  if (user.lastName == null || user.lastName.trim() === "" || user.lastName == "") {
    result += (result !== "" ? ", " : "") + 'Lastname required';
  }
  else if (user.lastName.length < 3) {
    //if(result!==""){result+=", ";}
    result += (result !== "" ? ", " : "") + "lastname too short";
  }
  if (user.password == null || user.password.trim() === "" || user.password == "") {
    result += (result !== '' ? ", " : "") + 'Enter your password';
  }
  if (user.dateOfBirth == null || user.dateOfBirth == "") {
    result += (result !== '' ? ", " : "") + 'Date of birth is required';
  }

  return result;
}



function validatep(user) {

  let result = "";
  if (user.email == null || user.email.trim() === "") {
    result += 'email is required';
  }
  else {
    var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    if (!user.email.match(validRegex)) {
      result += 'invalid email';

    }

  }


  if (user.firstName !== null || user.firstName.trim() === "") {
    if (user.lastName.length < 3) { result += "firstname too short"; }
    if (user.lastname == '') { result += "firstname Required" }
  }





  if (user.lastName !== null || user.lastName.trim() === "") {
    if (user.lastName.length < 3) { result += "lastname too short"; }
    if (user.lastname == '') { result += "Lastname Required" }
  }

  return result;
}

