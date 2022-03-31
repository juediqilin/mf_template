import { ElMessageBox } from 'element-plus'

export const confirmBox = async (tip = '是否关闭', cb) => {
  try {
    await ElMessageBox.confirm(tip)
    cb()
  } catch (e) {
  }
}
/**
 * @name debounce 函数防抖
 * @description 事件触发的间隔时间小于限定时间不执行
 * @param func 执行函数
 * @param delay 限定时间
 * */
export const debounce = (func, delay = 500) => {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func()
    }, delay)
  }
}

/**
 * @name debounce 函数节流
 * @description 在限定时间内只执行一次
 * @param func 执行函数
 * @param delay 限定时间
 * */
export const throttle = (func, delay = 1000) => {
  let timer
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      func()
    }, delay)
  }
}
