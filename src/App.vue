<script setup>
import { ref,computed } from 'vue'
const FILE_KEY = 'GAME_FILE'
const level = ref(1)
const isPlay = ref(false)
const isOut = ref(false)
const cardIcon = ['🐇','🥕','🐕','🐅','🥔','🍔','🍟','🦥','🐬','🐉','🦐','🦞','🕊️','🐧','🦚','🐖','🐏','🎈','🎉','🏀','🍍','🍌','🍊']
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
    const levelType = level.value + 8 // 几种图标
    const levelRank = level.value * 6 // 层数
    const list = [...cardIcon]
    list.sort(() => Math.random() - 0.5).splice(0,levelType).forEach(e => {
      available[e] = levelNum
    })
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
            x: 0 + index * 0.18,
            y: 7,
          }
        }else if(cardNum - 2 == i) {
          position = {
            x: 7 - index * 0.18,
            y: 7,
          }
        }else {
          position = resetPosition(rankList)
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
const resetPosition = (list) => {
  const x = Math.floor(Math.random() * 8) + (Math.random() - 0.5 > 0 ? 0.5 : 0)
  const y = Math.floor(Math.random() * 6) + (Math.random() - 0.5 > 0 ? 0.5 : 0)
  if(list.filter(e => Math.abs(x - e.x) < 1 && Math.abs(y - e.y) < 1).length) {
    return resetPosition(list)
  }else {
    return {x: x > 7 ? 7 : x,y}
  }
}

const cardStyle = ({x,y},i) => {
  return {
    transform: `translate(${x * 37.5}px,${y * 40}px)`,
    zIndex: i,
  }
}

const storeStyle = (i,index) => {
  return {
    zIndex: i,
    left: `${index * 37.5}px`
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
const addToPlace = async (item,i,index,status,storeObj) => {
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
  await setTimeSync(100)
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
    return isOut.value = true
  }
  if(cardList.value.filter(e => e.length).length === 0 && storeList.value.filter(e => (e || []).length).length === 0) {
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
const showToast = (text = '',duration = 1000) => {
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
</script>

<template>
  <div class="container">
    <p class="title">叮了个当</p>
    <template v-if="isPlay">
      <p class="desc">第{{level}}关</p>
      <p class="setup" @click="onSetup">⚙</p>
      <div class="map">
        <template v-for="(list,i) in cardList" :key="i">
          <template v-for="(item,index) in list" :key="item.id">
            <div class="card" @click="addToPlace(item,i,index,cardIsChild(item,i))" :class="{cardMask: cardIsChild(item,i)}" :style="cardStyle(item,i)">{{item.icon}}</div>
          </template>
        </template>
      </div>
      <div class="store">
        <template v-for="(list,i) in storeList" :key="i">
          <template v-for="(item,index) in list" :key="index">
            <div class="card" :style="storeStyle(i,index)" @click="addToPlace(item,item.i,null,false,{i,index})">{{item.icon}}</div>
          </template>
        </template>
      </div>
      <div class="place">
        <template v-for="(item,index) in placeList" :key="index">
          <div class="card" style="position: relative;">{{item.icon}}</div>
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
      <div class="out" v-if="isSetup">
        <div class="outBox">
          <span class="outClose" @click="isSetup = !isSetup">关闭</span>
          <p class="outTitle">设置</p>
          <div class="outText" @click="saveFile">存档</div>
          <div class="outText" @click="clearFile">清除存档</div>
        </div>
      </div>
    </template>
    <template v-else>
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
    <div class="toast" v-if="isToast">
      <span class="toastText">{{toastText}}</span>
    </div>
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
.container {
  width: 375px;
  height: 667px;
  background-color: #C3FF8B;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.title {
  padding-top: 40px;
  font-size: 36px;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 4px 0px #000;
}
.desc {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.setup {
  font-size: 30px;
  text-shadow: 0 2px 0px #000;
  color: #fff;
  position: absolute;
  right: 20px;
  top: 20px;
  user-select: none;
  cursor: pointer;
}

.rank {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.rankTitle {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.rankList {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(0,0,0,0.3);
  width: 240px;
  padding: 10px;
}
.rankItem {
  display: flex;
  align-items: center;
}
.rankAvatar {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 10px;
}
.rankText {
  font-size: 16px;
  color: #fff;
  flex: 1;
}
.rankLevel {
  font-size: 14px;
  color: #fff;
}

.footer {
  width: 280px;
  display: flex;
  justify-content: space-between;
}

.footer .btn+.btn {
  margin-left: 10px;
}

.btn {
  margin-top: 40px;
  margin-bottom: 40px;
  color: #333;
  font-size: 20px;
  flex: 1;
  border: 4px solid #000;
  text-align: center;
  padding: 14px 0;
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
  width: 260px;
  background-color: #fff;
  border: 4px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  position: relative;
}
.outClose {
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
.outTitle {
  font-size: 26px;
}
.outText {
  margin-top: 20px;
  font-size: 18px;
  width: 200px;
  text-align: center;
  border: 2px solid #666;
  padding: 6px 0;
  cursor: pointer;
}

.map {
  margin-top: 40px;
  width: 300px;
  height: 320px;
  position: relative;
}

.card {
  width: 37.5px;
  height: 40px;
  display: flex;
  justify-content: center;
  font-size: 24px;
  background-color: #F5FFCC;
  border-radius: 4px;
  border: 2px solid #333;
  position: absolute;
  overflow: hidden;
  cursor: pointer;
  left: 0;
  top: 0;
  user-select: none;
}
.card::after {
  content: "";
  width: 37.5px;
  height: 4px;
  background-color: #72A311;
  position: absolute;
  bottom: 0;
  left: 0;
}

.cardMask::before {
  content: "";
  width: 37.5px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.3);
}

.store {
  margin-top: 30px;
  height: 40px;
  width: 112.5px;
  display: flex;
  position: relative;
  /* background-color: #f00; */
}

.place {
  display: flex;
  margin-top: 20px;
  width: 271.5px;
  height: 48px;
  background-color: #965919;
  border-radius: 4px;
  border: 4px solid #C2822D;
}

.prop {
  margin-top: 20px;
  width: 271.5px;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.propText {
  width: 40px;
  height: 40px;
  line-height: 36px;
  background-color: #20A3FD;
  text-align: center;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  border: 2px solid #333;
}


.toast {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translate(-50%,0);
  background-color: rgba(0,0,0,0.6);
  padding: 6px 16px;
  border-radius: 4px;
  z-index: 101;
}
.toastText {
  color: #fff;
}
</style>