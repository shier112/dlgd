let pageWidth = window.innerWidth
setHtmlRem()
window.onresize = () => setHtmlRem()

function setHtmlRem() {
  pageWidth = window.innerWidth
  document.querySelector('html').style.fontSize = `${pageWidth / 7.5}px`
}