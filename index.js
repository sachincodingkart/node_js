//use path module
var path = require('path');
//use express module
var express = require('express');
//use hbs view engine
var session = require('express-session');


var hbs = require('hbs');
//use bodyParser middleware
var bodyParser = require('body-parser');
//use mysql database
var mysql = require('mysql');
var app = express();

//Create connection
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db1'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'hbs');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
 
//route for homepage
app.get('/',(req, res) => {  
    res.render('registration',{
    });
  });
 
//route for insert data
app.post('/signup',(req, res) => {
  let data = {name: req.body.name, last_name: req.body.last_name, email: req.body.email, contact: req.body.contact, password: req.body.password};
  let sql = "INSERT INTO user_data SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.render('login',{
      
    });
  });
});



app.post('/login',(req, res) => {

  var username = req.body.user_name
  var password = req.body.password;
   if (username && password) {
  let sql = "SELECT * FROM user_data WHERE email = '"+username+"' AND password = '"+password+"'";
  let query = conn.query(sql, (err, results) => {
   if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
      res.redirect('/home');
      } else {
        res.send('Incorrect Username and/or Password!');
      }     
      res.end();
    });
 }
 else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});

app.get('/home', function(req, res) {
  if (req.session.loggedin) {
    res.send('Welcome, ' + request.session.username + '!');
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});
//server listening
app.listen(8080, () => {
  console.log('Server is running at port 8080');
});
