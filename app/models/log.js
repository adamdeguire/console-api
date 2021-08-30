
const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: []
},
{
  timestamps: true
})

module.exports = mongoose.model('Log', logSchema)
