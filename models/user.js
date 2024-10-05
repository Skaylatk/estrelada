const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', Userschema)

module.exports = User