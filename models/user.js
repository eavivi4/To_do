const mongoose = require('mongoose')

// Create the user to be in the database, schema for MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true }
  
});

module.exports = mongoose.model('User', UserSchema);