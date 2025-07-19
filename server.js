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

// Get function from passport-config and 
// initialize function to find users based on email and id
const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// User array
const users = []

// Add ejs sythax
app.set('view-engine', 'ejs')
// Access email and password inside request variable in post request
app.use(express.urlencoded({extended: false}))



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

// Render HTML file
app.use(express.static(path.join(__dirname, 'public')))

// Render the login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// Render the register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {

    // req.body.name, req.body.email, req.body.password are 
    // from the ejs file, what comes after name="..." for each element
    try {

        // Hash password, 10 is default secure value to hash
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // Redirect to login page after success
        res.redirect('/login')
    } catch {

        // If there is a failure, redirect to register
        res.redirect('/register')
    }
})

app.post('/login', passport.authenticate('local', {

    // Authenication success redirect
    successRedirect: 'index.html',

    // Authentication failure redirect
    failureRedirect: '/login',

    // Messages from done function will be displayed
    failureFlash: true
}))

// Run on port 3000
app.listen(3000)