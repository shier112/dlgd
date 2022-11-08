const express = require('express')
const app = express()

// 设置变量
app.set('sercet','dlgd_666')

app.use(require('cors')())  // 跨域
app.use(express.json())  // json
app.get('/',(req,res) => {
  res.send('<h1>Hello world</h1>')
})

require('./plugins/db')(app)
require('./routes/web')(app)

app.listen(3000,() => {
  console.log('3000')
})