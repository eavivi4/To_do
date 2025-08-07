// Load environment variables
if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

// Add libraries
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')

// Get function from passport-config and 
// initialize function to find users based on email and id
const initializePassport = require('./passport-config')
initializePassport(passport, 
    async email => await User.findOne({email}),
    async id => await User.findById(id)
)

// Add ejs sythax
app.set('view-engine', 'ejs')
// Access email and password inside request variable in post request
app.use(express.urlencoded({extended: false}))

// Connect to local MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to local MongoDB'))
.catch(err => console.error(err));

// Use libraries
app.use(flash())
app.use(session({
    // Key from .env
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Integrating passport
app.use(passport.initialize())
app.use(passport.session())


// Render the first page
app.get('/', (req, res) => {
    res.redirect('/login')
})

// Have styles and index.js available
app.use(express.static(path.join(__dirname, 'public')))

// Protect index.html by checking authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Render HTML file
app.get('/todo', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'index.html'));
});

// Render the login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// Render log out
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err)
            {
                return next(err);
            } 
        res.redirect('/login');
    });
})

// Render the register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {

    try {
        
        const { email, password } = req.body;

        // Check if user already exists by email since it is unique
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash password, 10 is default secure value to hash
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Put information into User object
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        
        // Save User into database
        await newUser.save();

        // Redirect to login page after success
        res.redirect('/login')
    } catch {

        // If there is a failure, redirect to register
        res.redirect('/register')
    }
})

app.post('/login', passport.authenticate('local', {

    // Authenication success redirect
    successRedirect: '/todo',

    // Authentication failure redirect
    failureRedirect: '/login',

    // Messages from done function will be displayed
    failureFlash: true
}))

// Run on port 3000
app.listen(3000)