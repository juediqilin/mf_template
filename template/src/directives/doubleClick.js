
/**
 * v-btn 禁止按键连点
 */

export default {
  mounted (el, binding, vnode) {
    let timer
    el.addEventListener('click', function () {
      this.classList.add('is-disabled')
      this.disabled = true
      if (timer) return
      timer = setTimeout(() => {
        this.classList.remove('is-disabled')
        this.disabled = false
        clearTimeout(timer)
        timer = null
      }, 2000)
    })
  }
}
