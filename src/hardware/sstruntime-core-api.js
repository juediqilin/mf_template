// ----------------------------------------------------------------------
//  ********* Self-Service Terminal Runtime JavaScript APIs *********
//  *  自助终端中间件平台（Chromium容器，以下称运行环境）JavaScript接口说明  *
//  *****************************************************************
//
//  1. 异步回调
//     运行环境的JavaScript接口统一采用异步执行方式，所有执行结果（如果有的话）
//     通过传入的callback回调函数对象获取。callback函数对象形式如下：
//        let callback = function(jsonStr) {
//            // 对执行结果JSON字符串进行解析处理...
//        }
//     其中，callback函数对象的参数jsonStr为执行结果JSON字符串，数据结构如下：
//       {
//           "resultCode": -1,        // 执行状态码：0-执行成功，其他-错误码
//           "resultMessage": "",     // 执行结果说明信息
//           "data": {}               // 返回数据，只有在resultCode为0时有效，
//                                    // 具体数据结构由接口定义
//       }
//  2. 接口返回值
//     所有接口统一返回Boolean值。当接口返回true，表示接口异步调用成功，
//     但并不代表接口任务执行成功，任务执行结果需要通过callback回调
//     获取。当接口返回false时，则表示接口异步调用失败，callback
//     回调不会被执行到。
//  3. 异常处理
//     当程序内部执行异常时，则会抛出异常信息。
//  4. 版本号约定
//     {主版本号}.{次版本号}.{修订版本号}
//     主版本号 - 接口发生兼容性改变，无法向旧版本兼容。
//     次版本号 - 接口扩展，向旧版本兼容。
//     修订版本号 - 内部实现发生改变，接口不发生变化。
//     [注意]：这里的接口兼容性既包含terminal接口，也包括sstruntime接口。
// ----------------------------------------------------------------------

window.sstruntime = window.sstruntime || {}
window.sstruntime.execServiceSyncCmd = window.sstruntime.execServiceSyncCmd || function (deviceId, command, argument, callback) {
  console.log('emm...需要中间件才能调用到接口哟~')
  return false
}
window.sstruntime.execServiceAsyncCmd = window.sstruntime.execServiceAsyncCmd || function (deviceId, command, argument, callback, timeout) {
  console.log('emm...需要中间件才能调用到接口哟~')
  return false
}

/**
 * -- Runtime Core APIs（中间件运行环境核心APIs） --
 */
export const runtimeCoreApi = {

  /**
     * -- 服务调用APIs --
     */
  service: {
    /**
         * -- 执行同步服务命令 --
         * @brief 同步执行服务命令指的是在主进程（browser进程）中同步执行，JavaScript代码的执行是在
         *        渲染进程（Render进程）中，因此还是需要通过回调函数来取回执行结果。
         * @example
         *        if (!terminal.service.exec(serviceId, command, argument, result => {
         *            if (result.resultCode === 0) {
         *                // 执行服务命令成功
         *            } else {
         *                // 执行服务命令失败
         *            }
         *        })) {
         *            // 执行JS接口失败，进行失败处理
         *        }
         * @param serviceId {String}
         *        服务ID
         * @param command {String}
         *        服务命令，对应要执行的操作，具体由服务来定义。
         * @param argument {object}
         *        执行服务命令所要求的参数，具体数据结构由服务及对应的服务命令来定义。
         * @param callback {Function}
         *        回调函数对象，参考调用示例。result数据结构如下：
         *        {
         *          "resultCode": 0,             // 执行结果状态码
         *          "resultMessage": "",         // 执行结果附加说明信息
         *          "data": {}                   // 执行设备操作命令返回的结果数据，具体由设备及其操作命令确定。
         *        }
         * @return {Boolean}
         *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
         *       返回false则表示运行环境处理JS接口调用失败。
         */
    exec: function (serviceId, command, argument, callback) {
      return window.sstruntime.execServiceSyncCmd(
        serviceId,
        command,
        JSON.stringify(argument),
        jsonStr => {
          callback(JSON.parse(jsonStr))
        })
    },

    /**
         * -- 执行异步服务命令 --
         * @brief 异步服务命令是在主进程中异步执行，不会阻塞主进程的主线程。
         * @example
         *        if (!terminal.service.async(serviceId, command, argument, timeout, result => {
         *            if (result.resultCode === 0) {
         *                // 执行服务命令成功
         *            } else {
         *                // 执行服务命令失败
         *            }
         *        })) {
         *            // 执行JS接口失败，进行失败处理
         *        }
         * @param serviceId {String}
         *        服务ID
         * @param command {String}
         *        服务命令，对应要执行的操作，具体由服务来定义。
         * @param argument {Object}
         *        执行服务命令所要求的参数，具体数据结构由服务及对应的服务命令来定义。
         * @param timeout {Number}
         * @param callback {Function}
         *        回调函数对象，参考调用示例。jsonStr为JSON字符串，数据结构如下：
         *        {
         *          "resultCode": 0,             // 执行结果状态码
         *          "resultMessage": "",         // 执行结果附加说明信息
         *          "data": {}                   // 执行设备操作命令返回的结果数据，具体由设备及其操作命令确定。
         *        }
         *        异步等待超时。
         * @return {Boolean}
         *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
         *       返回false则表示运行环境处理JS接口调用失败。
         */
    async: function (serviceId, command, argument, timeout, callback) {
      return window.sstruntime.execServiceAsyncCmd(
        serviceId,
        command,
        JSON.stringify(argument),
        timeout,
        jsonStr => {
          callback(JSON.parse(jsonStr))
        })
    }

  }
}
