const express = require('express');//for Express
const hbs = require('hbs');//for Handlebars
const fs = require('fs');//to write to server

const port = process.env.PORT || 3000;//gets port number assigned by Heroku or uses 3000

var app = express();

hbs.registerPartials(__dirname + '/views/partials');//locations of partials
app.set('view engine', 'hbs');


//Express middleware to log to console and create a log file on the server regarding use
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  });
  next();
});

//Express middleware, when in place will stop all access to the site except to maintenance page
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//Handlebar helper to get the current year
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
//Handlebar helper to capitalise all characters
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//Public pages
app.use(express.static(__dirname + '/public'));
//page rendering
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Why do you come here',
    });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'My Projects',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Silly billy, wrong place'
  });
});

//designating the port for the webserver to run on
app.listen(port, () => {
  console.log(`server is up on port ${port}`)
});
