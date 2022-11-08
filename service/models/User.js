const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String },
  password: { 
    type: String,
    select: false,
    set(val) {
      return require('bcrypt').hashSync(val,10)
    }
  },
  name: { type: String },
  avatar: { type: String },
  desc: { type: String },
  sex: { type: Number },
  isAdmin: { type: Boolean },
  createTime: { type: String },
  updateTime: { type: String },
})

module.exports = mongoose.model('User',schema)