const User = require('./models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById)
{
    // Call from login to make sure user is correct
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email: email})
        if (user == null)
        {
            // If the user does not exist
            return done(null, false, {message: 'No user with that email'})
        }
        try {

            // Compare password from user and one saved
            if(await bcrypt.compare(password, user.password))
            {
                // return the user that is authenticated
                return done(null, user)
            }
            else
            {
                // If the password does not match the saved password for the user
                return done(null, false, {message: 'Password incorrect'})
            }

        } catch (e) {
            // If there is a problem with the application, return that error
            return done(e)
        }
    }

    // Pass variables to strategy
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))

    //
    passport.serializeUser((user, done) => done(null, user.id))

    //
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

// Export function
module.exports = initialize