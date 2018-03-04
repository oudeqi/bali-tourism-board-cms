export function isUrl (value) {
  // return /^(ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(value)
  return value
}
export function loadScript (src, callback) {
  if (document.getElementById('ggMapScript')) {
    callback()
  } else {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'ggMapScript'
    script.onload = script.onreadystatechange = function () {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        callback()
        script.onload = script.onreadystatechange = null
      }
    }
    script.src = src
    head.appendChild(script)
  }
}
