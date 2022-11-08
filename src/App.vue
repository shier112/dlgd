<script setup>
import { ref,computed } from 'vue'
const FILE_KEY = 'GAME_FILE'
const BG_KEY = 'BG_COLOR'
const level = ref(1)
const isPlay = ref(false)
const isOut = ref(false)
const isOver = ref(false)
const bgColor = ref(localStorage.getItem(BG_KEY) || '#C3FF8B')
const cardIcon = ['baozi','pingguo','chengzi','qingjiao','jidan','xihongshi','mangguo','baocai','niunai','mianbao','huluobu','zhangyu','pangxie','yangcong','rou','jitui','huage','xianyu','mogu','qiezi','xilanhua','ningmeng','liulian','banli','sanwenyu','tudou','xigua','nangua','huolongguo','fantuan','zhusun','shanzhu','lanmei','shiliu','yezi','tiangua','mihoutao','boluo','taozi','xiangjiao','caomei','niuyouguo','hamigua','chelizi','li','bale','juzi','baixiangguo','putao','shaomai','yumi','pipa','yangtao','youzi','lianwu','wuhuaguo','wandou','huanggua','suantou','lizhi','boluomi','yuancaitou','baicai']
const placeList = ref([])
const cardList = ref([])
const storeList = ref([])
const rankList = ref([
  { avatar: 'http://inews.gtimg.com/newsapp_bt/0/9680744078/641',name: '只因' },
  { avatar: 'http://inews.gtimg.com/newsapp_bt/0/9680744080/641',name: '鸡鸡' },
  { avatar: 'http://inews.gtimg.com/newsapp_bt/0/9680744081/641',name: '坤你太美' },
  { avatar: 'http://inews.gtimg.com/newsapp_bt/0/9680744082/641',name: '可达坤' }
])

// 点击开始游戏
const onPlay = () => {
  isPlay.value = !isPlay.value
  level.value = 1
  placeList.value = []
  storeList.value = []
  resetMap()
}

// 重新开始
const onResetPlay = () => {
  isOut.value = false
  level.value = 1
  // cardList.value = []
  placeList.value = []
  storeList.value = []
  resetMap()
}

// 退出游戏
const onQuit = () => {
  isPlay.value = false
  isOut.value = false
}

// 按照关卡生成地图
const resetMap = () => {
  if(level.value === 1) {
    cardList.value = [
      [
        { icon: '',x: 1.5,y: 2 },
        { icon: '',x: 1.5,y: 4 },
        { icon: '',x: 1.5,y: 6 },
        { icon: '',x: 3.5,y: 2 },
        { icon: '',x: 3.5,y: 4 },
        { icon: '',x: 3.5,y: 6 },
        { icon: '',x: 5.5,y: 2 },
        { icon: '',x: 5.5,y: 4 },
        { icon: '',x: 5.5,y: 6 }
      ],
      [
        { icon: '',x: 1.5,y: 2.4 },
        { icon: '',x: 1.5,y: 4.4 },
        { icon: '',x: 1.5,y: 6.18 },
        { icon: '',x: 3.5,y: 2.4 },
        { icon: '',x: 3.5,y: 4.4 },
        { icon: '',x: 3.5,y: 6.18 },
        { icon: '',x: 5.5,y: 2.4 },
        { icon: '',x: 5.5,y: 4.4 },
        { icon: '',x: 5.5,y: 6.18 }
      ]
    ]
    const available = {}
    const list = [...cardIcon]
    list.sort(() => Math.random() - 0.5).splice(0,3).forEach(e => {
      available[e] = 6
    })
    cardList.value.forEach(item => {
      item.forEach(e => {
        e.icon = resetIcon(available)
        e.id = Math.floor(Math.random() * 9999)
        available[e.icon]--
        if(!available[e.icon]) {
          delete available[e.icon]
        }
      })
    })
  }else {
    const available = {} // 图标对象
    const levelNum = level.value * 6 // 每一种图标的数量
    const levelType = level.value + 6 // 几种图标
    const levelRank = level.value * 3 // 层数
    const list = [...cardIcon]
    list.sort(() => Math.random() - 0.5).splice(0,levelType).forEach(e => {
      available[e] = levelNum
    })
    // const numList = [...fillWithRandom(levelNum * levelType,levelRank)].sort((a,b) => a - b)
    // console.log(numList)
    cardList.value = new Array(levelRank).fill().map((item,index) => {
      const rankList = []
      const cardNum = levelNum * levelType / levelRank
      return new Array(cardNum).fill().map((e,i) => {
        const icon = resetIcon(available)
        available[icon]--
        if(!available[icon]) {
          delete available[icon]
        }
        let position = {}
        if(cardNum - 1 == i) {
          position = {
            x: 0 + index * 0.15,
            y: 7,
          }
        }else if(cardNum - 2 == i) {
          position = {
            x: 7 - index * 0.15,
            y: 7,
          }
        }else if(level.value >= 4 && cardNum - 3 == i) {
          position = {
            x: 0 + index * 0.15,
            y: 5.8,
          }
        }else if(level.value >= 4 && cardNum - 4 == i) {
          position = {
            x: 7 - index * 0.15,
            y: 5.8,
          }
        }else {
          position = resetPosition(rankList,level.value >= 4 ? 5 : 6)
        }
        rankList.push(position)
        return {
          icon: icon,
          ...position,
          id: Math.floor(Math.random() * 9999)
        }
      })
    })
  }
}

// 随机生成数量
const fillWithRandom = (result, layer,min = 2) => {
  if (layer > result) return new Array(layer).fill(1)
  const array = new Array(layer).fill(0)
  array[layer - 1] = min
  const sum = (arr) => arr.reduce((prev, item) => prev + item, 0)
  for (let i = layer - 2; i >= 0; i--) {
    if (i === 0) {
      array[i] = result - sum(array)
    } else {
      array[i] = Math.ceil((result - sum(array) - Math.random() * layer) / 5)
    }
  }
  return array.sort((a, b) => a - b)
}

// 随机生成图标
const resetIcon = (obj) => {
  const icon = Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]
  if(obj[icon]) {
    return icon
  }else {
    return resetIcon(obj)
  }
}

// 随机生成坐标
const resetPosition = (list,maxY = 6) => {
  let x = Math.floor(Math.random() * 8) + (Math.random() - 0.5 > 0 ? 0.5 : 0)
  let y = Math.floor(Math.random() * maxY) + (Math.random() - 0.5 > 0 ? 0.5 : 0)
  x = x > 7 ? 7 : x // 地图最大限制
  y = y > maxY ? maxY : y
  if(list.filter(e => Math.abs(x - e.x) < 1 && Math.abs(y - e.y) < 1).length) {
    return resetPosition(list,maxY)
  }else {
    return {x,y}
  }
}

const cardStyle = ({x,y},i) => {
  return {
    transform: `translate(${x * 0.75}rem,${y * 0.8}rem)`,
    zIndex: i,
  }
}

const storeStyle = (i,index) => {
  return {
    zIndex: i,
    left: `${index * 0.75}rem`
  }
}

// 是否可以点击
const cardIsChild = computed(() => {
  return function({x,y},i) {
    const parent = cardList.value[i + 1]
    if(!parent) return false
    const allList = []
    cardList.value.slice(i + 1,9999).forEach(e => {
      allList.push(...e)
    })
    return allList.filter(({x: pX,y: pY}) => {
      return Math.abs(x - pX) < 1 && Math.abs(y - pY) < 1
    }).length
  }
})

// 点击卡片
const addToPlace = (item,i,index,status,storeObj) => {
  if(status) return
  const cache = {}
  lastItem.value = storeObj ? {} : {...item,i}
  placeList.value.push({...item,i})
  placeList.value.forEach(e => {
    if(cache[e.icon]) {
      cache[e.icon].push(e)
    }else {
      cache[e.icon] = [e]
    }
  })
  // await setTimeSync(100)
  Object.keys(cache).forEach(key => {
    if(cache[key].length === 3) {
      delete cache[key]
    }
  })
  const sortList = []
  Object.values(cache).sort((a,b) => {
    return a.length - b.length
  }).forEach(e => {
    sortList.unshift(...e)
  })
  placeList.value = sortList
  if(index !== null) {
    cardList.value[i].splice(index,1)
  }
  if(storeObj) {
    storeList.value[storeObj.i].splice(storeObj.index,1)
  }
  if(placeList.value.length === 7) {
    localStorage.removeItem(FILE_KEY)
    isFile.value = false
    return isOut.value = true
  }
  if(cardList.value.filter(e => e.length).length === 0 && storeList.value.filter(e => (e || []).length).length === 0) {
    if(level.value == 10) {
      isOver.value = true
      return showToast('成功通关',2000)
    }
    showToast('进入下一关,难度飙升',2000)
    level.value++
    resetMap()
  }
}

const setTimeSync = (time = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    },time)
  })
}

const lastItem = ref({})
// 上移
const onUpcard = () => {
  if(!placeList.value.length) return
  storeList.value.push(placeList.value.splice(0,3))
}
// 撤回
const onRecall = () => {
  if(!placeList.value.length) return
  const lastIndex = placeList.value.findIndex((e) => e.id === lastItem.value.id)
  if(lastIndex === -1) return
  placeList.value.splice(lastIndex,1)
  cardList.value[lastItem.value.i].push(lastItem.value)
}
// 随机
const onRandom = () => {
  const available = {}
  cardList.value.forEach(item => {
    item.forEach(e => {
      if(available[e.icon]) {
        available[e.icon]++
      }else {
        available[e.icon] = 1
      }
    })
  })
  cardList.value.forEach(item => {
    item.forEach(e => {
      e.icon = resetIcon(available)
      available[e.icon]--
      if(!available[e.icon]) {
        delete available[e.icon]
      }
    })
  })
}

const isToast = ref(false)
const toastText = ref('')
const showToast = (text = '',duration = 20000) => {
  toastText.value = text
  isToast.value = true
  setTimeout(() => {
    isToast.value = false
  },duration)
}

const isSetup = ref(false)
// 设置
const onSetup = () => {
  isSetup.value = !isSetup.value
}

const isFile = ref(false)
isFile.value = Boolean(localStorage.getItem(FILE_KEY))
// 存档
const saveFile = () => {
  localStorage.setItem(FILE_KEY,JSON.stringify({
    level: level.value,
    cardList: cardList.value,
    storeList: storeList.value,
    placeList: placeList.value,
    lastItem: lastItem.value,
  }))
  isFile.value = true
  showToast('存档成功!')
}

const clearFile = () => {
  localStorage.removeItem(FILE_KEY)
  isFile.value = false
  showToast('清除成功!')
}

const nextPlay = () => {
  const gameObj = JSON.parse(localStorage.getItem(FILE_KEY))
  level.value = gameObj.level
  cardList.value = gameObj.cardList
  storeList.value = gameObj.storeList
  placeList.value = gameObj.placeList
  lastItem.value = gameObj.lastItem
  isPlay.value = true
}

const saveBgColor = (e) => {
  localStorage.setItem(BG_KEY,e.target.value)
}

import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000/web/api/'
})
http.interceptors.response.use(
  response => response.data
)
// 登录
const isLogin = ref(false)
const loginForm = ref({
  username: 'a123456',
  password: '123123aA',
})
const onLogin = async () => {
  const { username,password } = loginForm.value
  if(!username.length) return showToast('请输入用户名')
  if(!password.length) return showToast('请输入密码')
  const res = await http.post('login',loginForm.value)
  showToast(res.message)
  if(res.code === 200) {
    isLogin.value = true
  }
}

const isRegister = ref(false)
const registerForm = ref({
  username: 'a123456',
  password: '123123aA',
  enterPwd: '123123aA',
})
const onRegister = async () => {
  const { username,password,enterPwd } = registerForm.value
  if(!username.length) return showToast('请输入用户名')
  if(!password.length) return showToast('请输入密码')
  if(!enterPwd.length) return showToast('请输入确认密码')
  if(password !== enterPwd) return showToast('两次密码不相同')
  const res = await http.post('register',registerForm.value)
  showToast(res.message)
  if(res.code === 200) {
    isRegister.value = false
  }
}
</script>

<template>
  <div class="container" :style="{backgroundColor: bgColor}">
    <p class="title">叮了个当</p>
    <template v-if="isPlay">
      <p class="desc">第{{level}}关</p>
      <p class="setup" @click="onSetup">⚙</p>
      <div class="map">
        <template v-for="(list,i) in cardList" :key="i">
          <template v-for="(item,index) in list" :key="item.id">
            <div class="card" @click="addToPlace(item,i,index,cardIsChild(item,i))" :class="{cardMask: cardIsChild(item,i)}" :style="cardStyle(item,i)">
              <svg aria-hidden="true">
                <use :xlink:href="`#icon-${item.icon}`"></use>
              </svg>
            </div>
          </template>
        </template>
      </div>
      <div class="store">
        <template v-for="(list,i) in storeList" :key="i">
          <template v-for="(item,index) in list" :key="index">
            <div class="card" :style="storeStyle(i,index)" @click="addToPlace(item,item.i,null,false,{i,index})">
              <svg aria-hidden="true">
                <use :xlink:href="`#icon-${item.icon}`"></use>
              </svg>
            </div>
          </template>
        </template>
      </div>
      <div class="place">
        <template v-for="(item,index) in placeList" :key="index">
          <div class="card" style="position: relative;">
            <svg aria-hidden="true">
              <use :xlink:href="`#icon-${item.icon}`"></use>
            </svg>
          </div>
        </template>
      </div>
      <div class="prop">
        <div class="propText" @click="onUpcard">上移</div>
        <div class="propText" @click="onRecall">撤回</div>
        <div class="propText" @click="onRandom">随机</div>
      </div>
      <div class="out" v-if="isOut">
        <div class="outBox">
          <p class="outTitle">游戏失败</p>
          <div class="outText" @click="onResetPlay">重新开始</div>
          <div class="outText" @click="onQuit">退出游戏</div>
        </div>
      </div>
      <div class="out" v-if="isOver">
        <div class="outBox">
          <p class="outTitle">成功通关</p>
          <div class="outText" @click="onResetPlay">重新开始</div>
          <div class="outText" @click="onQuit">退出游戏</div>
        </div>
      </div>
      <div class="out" v-if="isSetup">
        <div class="outBox">
          <span class="outClose" @click="isSetup = !isSetup">关闭</span>
          <p class="outTitle">设置</p>
          <div class="outText" @click="saveFile">存档</div>
          <div class="outText" @click="clearFile">清除存档</div>
          <input class="outText" type="color" v-model="bgColor" @blur="saveBgColor">
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="isLogin">
        <div class="rank">
          <p class="rankTitle">排行榜</p>
          <div class="rankList">
            <template v-for="(item,index) in rankList" :key="index">
              <div class="rankItem">
                <img class="rankAvatar" src="./assets/641.webp" alt="">
                <span class="rankText">{{item.name}}</span>
                <span class="rankLevel">{{index+1}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="footer">
          <div class="btn" @click="onPlay">开始游戏</div>
          <div class="btn" v-if="isFile" @click="nextPlay">继续游戏</div>
        </div>
      </template>
      <template v-else>
        <div class="login" v-if="isRegister">
          <p class="loginTitle">注册</p>
          <input class="loginInput" v-model="registerForm.username" type="text" placeholder="账号">
          <input class="loginInput" v-model="registerForm.password" type="password" placeholder="密码">
          <input class="loginInput" v-model="registerForm.enterPwd" type="password" placeholder="二次输入密码">
          <div class="loginBtn" @click="noRegister">注册</div>
        </div>
        <div class="login" v-else>
          <p class="loginTitle">登录</p>
          <input class="loginInput" v-model="loginForm.username" type="text" placeholder="账号">
          <input class="loginInput" v-model="loginForm.password" type="password" placeholder="密码">
          <p class="loginDesc" @click="isRegister = true">没有账号?去注册</p>
          <div class="loginBtn" @click="onLogin">确认登录</div>
        </div>
      </template>
    </template>
    <div class="toast" v-if="isToast">{{toastText}}</div>
  </div>
</template>

<style>
@font-face {
  font-family: "阿里妈妈数黑体 Bold";
  font-weight: 700;
  src: url("//at.alicdn.com/wf/webfont/GPOBH1koEiFq/3ebqCXnQLausE0NASdcUD.woff2") format("woff2"),
  url("//at.alicdn.com/wf/webfont/GPOBH1koEiFq/GOG_pwWIbNhRdazkeljUO.woff") format("woff");
  font-display: swap;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "阿里妈妈数黑体 Bold";
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  margin-top: 1.8rem;
  width: 5.6rem;
  background-color: #fff;
  border: 4px solid #000;
  display: flex;
  flex-direction: column;
  padding: 0.6rem 0.6rem;
}
.login .loginTitle {
  font-size: 0.54rem;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.4rem;
  
}
.login .loginInput {
  margin: 0.2rem 0;
  padding: 0.2rem 0;
  font-family: "阿里妈妈数黑体 Bold";
  outline: none;
  border: 0;
  font-size: 0.40rem;
  color: #333;
  border-bottom: 1px solid #f2f2f2;
}
.login .loginDesc {
  margin-top: 0.1rem;
  font-size: 0.32rem;
  text-align: right;
  color: #666;
}
.login .loginBtn {
  margin-top: 0.4rem;
  color: #333;
  font-size: 0.4rem;
  flex: 1;
  border: 4px solid #000;
  text-align: center;
  padding: 0.28rem 0;
  background-color: #fff;
  cursor: pointer;
}
.container {
  width: 7.5rem;
  height: 100vh;
  background-color: #C3FF8B;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.title {
  padding-top: 0.8rem;
  font-size: 0.72rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0.08rem 0 #000;
}
.desc {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 1.8rem;
  font-size: 0.28rem;
  color: #333;
  font-weight: bold;
}
.setup {
  font-size: 0.6rem;
  text-shadow: 0 0.04rem 0 #000;
  color: #fff;
  position: absolute;
  right: 0.4rem;
  top: 0.4rem;
  user-select: none;
  cursor: pointer;
}

.rank {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.rankTitle {
  font-size: 0.28rem;
  color: #333;
  text-align: center;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}
.rankList {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(0,0,0,0.3);
  width: 4.8rem;
  padding: 0.2rem;
}
.rankItem {
  display: flex;
  align-items: center;
}
.rankAvatar {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 0.6rem;
  margin-right: 0.2rem;
}
.rankText {
  font-size: 0.32rem;
  color: #fff;
  flex: 1;
}
.rankLevel {
  font-size: 0.28rem;
  color: #fff;
}

.footer {
  width: 5.6rem;
  display: flex;
  justify-content: space-between;
}

.footer .btn+.btn {
  margin-left: 0.2rem;
}

.btn {
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
  color: #333;
  font-size: 0.4rem;
  flex: 1;
  border: 4px solid #000;
  text-align: center;
  padding: 0.28rem 0;
  background-color: #fff;
  cursor: pointer;
}

.out {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.outBox {
  width: 5.2rem;
  background-color: #fff;
  border: 4px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0;
  position: relative;
}
.outClose {
  font-size: 0.28rem;
  font-weight: bold;
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  cursor: pointer;
}
.outTitle {
  font-size: 0.52rem;
}
.outText {
  margin-top: 0.4rem;
  font-size: 0.36rem;
  width: 4rem;
  text-align: center;
  border: 2px solid #666;
  padding: 0.12rem 0;
  cursor: pointer;
}

.map {
  margin-top: 0.8rem;
  width: 6rem;
  /* height: 6.4rem; */
  flex: 1;
  position: relative;
}

.card {
  width: 0.75rem;
  height: 0.8rem;
  display: flex;
  justify-content: center;
  font-size: 0.48rem;
  background-color: #F5FFCC;
  border-radius: 0.08rem;
  border: 2px solid #333;
  position: absolute;
  overflow: hidden;
  cursor: pointer;
  left: 0;
  top: 0;
  user-select: none;
  padding: 0.1rem 0.1rem 0.16rem 0.1rem;
}
.card::after {
  content: "";
  width: 0.75rem;
  height: 4px;
  background-color: #72A311;
  position: absolute;
  bottom: 0;
  left: 0;
}

.cardMask::before {
  content: "";
  width: 0.75rem;
  height: 0.8rem;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.3);
}

.store {
  margin-top: 0.6rem;
  height: 0.8rem;
  width: 2.25rem;
  display: flex;
  position: relative;
  /* background-color: #f00; */
}

.place {
  display: flex;
  margin-top: 0.4rem;
  width: 5.43rem;
  height: 0.96rem;
  background-color: #965919;
  border-radius: 0.08rem;
  border: 4px solid #C2822D;
}

.prop {
  margin-top: 0.4rem;
  margin-bottom: 0.6rem;
  width: 5.43rem;
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
}
.propText {
  width: 0.8rem;
  height: 0.8rem;
  line-height: 0.72rem;
  background-color: #20A3FD;
  text-align: center;
  font-size: 0.24rem;
  color: #fff;
  border-radius: 0.08rem;
  border: 2px solid #333;
}


.toast {
  position: absolute;
  top: 0.8rem;
  left: 50%;
  transform: translate(-50%,0);
  background-color: rgba(0,0,0,0.6);
  padding: 0.12rem 0.2rem;
  border-radius: 0.08rem;
  z-index: 101;
  font-size: 0.32rem;
  color: #fff;
}
</style>