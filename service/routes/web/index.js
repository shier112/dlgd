module.exports = app => {
  const express = require('express')
  const router = express.Router()

  // 用户注册接口
  router.post('/register',async (req,res) => {
    const { username,password } = req.body
    const User = require('../../models/User')
    // 根据用户名找用户
    const user = await User.findOne({ username })
    if(user) return res.send({ code: 500,data: {},message: '用户已存在' })
    const model = await User.create(req.body)
    res.send({ code: 200,data: model,message: '注册成功!' })
  })

  // 用户登录接口
  router.post('/login',async (req,res) => {
    const { username,password } = req.body
    const User = require('../../models/User')
    // 根据用户名找用户
    const user = await User.findOne({ username }).select('+password')
    console.log(user)
    if(!user) return res.send({ code: 500,data: {},message: '用户不存在' })
    // 校验密码是否正确
    const isValid = require('bcrypt').compareSync(password,user.password)
    if(!isValid) return res.send({ code: 500,data: {},message: '密码错误' })
    // 返回用户token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({id: user._id}, app.get('sercet'))
    res.send({ code: 200,data: { token },message: '登录成功!' })
  })

  // 获取用户信息
  router.get('/userinfo',async (req,res) => {
    
  })

  app.use('/web/api',router)
}