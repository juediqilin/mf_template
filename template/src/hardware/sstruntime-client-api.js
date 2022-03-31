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

import { runtimeCoreApi } from './sstruntime-core-api.js'

window.sstruntime = sstruntime || {}
/**
 * -- Runtime Client APIs（客户端APIs） --
 */
export const runtimeClientApi = {

  /**
     * -- 重新加载页面 --
     */
  reload: function () {
    window.sstruntime.reload()
  },

  /**
     * -- 重新加载页面（忽略缓存） --
     */
  reloadIgnoreCache: function () {
    window.sstruntime.reloadIgnoreCache()
  },

  /**
     * -- 加载url --
     * @param url
     */
  loadUrl: function (url) {
    window.sstruntime.loadUrl(url)
  },

  /**
     * -- 打开第三方浏览器并加载url --
     * @param browser
     *        浏览器名称。目前支持一下浏览器
     *        'ie':       IE浏览器
     *        '360es':    360浏览器
     *        'chrome':   谷歌浏览器
     *        'firefox':  火狐浏览器
     * @param url
     * @param callback
     */
  loadUrlWith: function (browser, url, callback) {
    return runtimeCoreApi.service.exec(
      'loadWithOtherBrowserService',
      'LoadUrl',
      {
        url: url,
        browser: browser
      },
      callback)
  },

  /**
     * -- 检查是否有数据 --
     * @brief 检查给定键值是否有对应的存储数据。
     * @example
     *        if (!terminal.client.hasData(key, result => {
     *            if (result.resultCode === 0) {
     *                // 给定键值有对应存储数据
     *            } else {
     *                // 给定键值没有存储数据
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param key
     *        要检查的存储数据对应的键值。
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,         // 检查结果码，有对应存储数据则为0，否则没有对应存储数据。
     *            "resultMessage": ""      // 检查结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  hasData: function (key, callback) {
    return window.sstruntime.hasData(key, jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 获取数据 --
     * @brief 获取存储在客户端本地指定键值的数据内容。
     * @example
     *        if (!terminal.client.getData(key, result => {
     *            if (result.resultCode === 0) {
     *                // 获取数据成功，数据内容从result.data.content提取。
     *            } else {
     *                // 获取数据失败，进行失败处理
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param key
     *        要获取的存储数据对应的键值。
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,         // 获取数据结果码，成功为0，其他为错误码。
     *            "resultMessage": "",     // 获取数据结果说明信息
     *            "data": {
     *                "content": ""        // 给定键值对应的存储数据内容
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getData: function (key, callback) {
    return window.sstruntime.getData(key, jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 存储数据 --
     * @brief 将指定键值的数据存储到客户端本地。如果指定的键值已经存有数据，则将原数据返回。
     * @example
     *        if (!terminal.client.storeData(key, data, result => {
     *            if (result.resultCode === 0) {
     *                // 存储数据成功。可以从从result.data.previous中提取原先已经保存的数据（有的话）。
     *            } else {
     *                // 存储数据失败，进行失败处理
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param key {String}
     *        要存储的数据对应的键值。
     * @param data {String}
     *        要存储的数据类型。
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,         // 存储数据结果码，成功为0，其他为错误码。
     *            "resultMessage": "",     // 存储数据结果说明信息
     *            "data": {
     *                "previous": ""       // 给定键值对应原先存储的数据内容。如果没有的话则为null。
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  storeData: function (key, data, callback) {
    return window.sstruntime.storeData(key, data, jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 获取所有存储数据键值 --
     * @example
     *        if (!terminal.client.getAllDataKeys(result => {
     *            if (result.resultCode === 0) {
     *                // 获取所有存储数据键值列表成功
     *            } else {
     *                // 获取所有存储数据键值列表失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,         // 结果码，成功为0，其他为错误码。
     *            "resultMessage": "",     // 结果说明信息
     *            "data": {
     *                "keys": []           // 所有存储数据对应的键值列表
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getAllDataKeys: function (callback) {
    return window.sstruntime.getAllDataKeys(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 获取所有屏幕ID --
     * @example
     *        if (!terminal.client.getAllScreenId(result => {
     *            if (result.resultCode === 0) {
     *                // 获取成功
     *            } else {
     *                // 获取失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,         // 结果码，成功为0，其他为错误码。
     *            "resultMessage": "",     // 结果说明信息
     *            "data": {
     *                "screens": []        // 屏幕ID列表
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getAllScreenId: function (callback) {
    return window.sstruntime.getAllScreenId(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 获取当前显示器个数 --
     * @brief 获取当前系统连接的物理显示器的个数。
     * @example
     *        if (!terminal.client.queryMonitorCount(jsonStr => {
     *            let result = JSON.parse(jsonStr);
     *            if (result.resultCode === 0) {
     *                // 检测成功，可以使用result.data.count（为数值类型）
     *            } else {
     *                // 检测失败，进行失败处理
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,        // 检测结果码，成功为0，其他为错误码。
     *            "resultMessage": "",    // 检测结果说明信息
     *            "data": {               // 检测结果数据，只有resultCode为0时有效。
     *                "monitorCount": 0      // 显示器的数量
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  queryMonitorCount: function (callback) {
    return window.sstruntime.queryMonitorCount(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 获取当前屏幕个数 --
     * @brief 获取当前系统显示的屏幕个数。
     * @example
     *        if (!terminal.client.queryScreenCount(jsonStr => {
     *            let result = JSON.parse(jsonStr);
     *            if (result.resultCode === 0) {
     *                // 检测成功，可以使用result.data.count（为数值类型）
     *            } else {
     *                // 检测失败，进行失败处理
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,        // 检测结果码，成功为0，其他为错误码。
     *            "resultMessage": "",    // 检测结果说明信息
     *            "data": {               // 检测结果数据，只有resultCode为0时有效。
     *                "screenCount": 0       // 屏幕的数量
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  queryScreenCount: function (callback) {
    return window.sstruntime.queryScreenCount(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 复制并投放屏幕 --
     * @brief 复制配置指定的目标屏幕画面，并实时投放显示到配置指定的输出屏幕上。
     * @example
     *        if (!terminal.client.duplicateDisplays(jsonStr => {
     *            let result = JSON.parse(jsonStr);
     *            if (result.resultCode === 0) {
     *                // 投屏成功
     *            } else {
     *                // 投屏失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,        // 投屏结果码，成功为0，其他为错误码。
     *            "resultMessage": "",    // 投屏结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  duplicateDisplays: function (callback) {
    return window.sstruntime.duplicateDisplays(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 检测当前是否正在投屏 --
     * @brief 检测当前是否又在投放屏幕画面。
     * @example
     *        if (!terminal.client.isDuplicatingDisplays(jsonStr => {
     *            let result = JSON.parse(jsonStr);
     *            if (result.resultCode === 0) {
     *                // 检测投屏成功，获取result.data.flag检测结果
     *            } else {
     *                // 检测投屏失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,        // 检测投屏结果码，成功为0，其他为错误码。
     *            "resultMessage": "",    // 检测投屏结果说明信息
     *            "data": {
     *                "flag": true        // 投屏检测结果标识：true  - 正在投屏
     *            }                                            false - 没有投屏
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  isDuplicatingDisplays: function (callback) {
    return window.sstruntime.isDuplicatingDisplays(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 取消投放屏幕 --
     * @brief 取消投放屏幕。如果当前没有进行投屏的话，则不做任何操作，并返回成功。
     * @example
     *        if (!terminal.client.cancelDuplicateDisplays(jsonStr => {
     *            let result = JSON.parse(jsonStr);
     *            if (result.resultCode === 0) {
     *                // 取消投屏成功
     *            } else {
     *                // 取消投屏失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,        // 取消投屏结果码，成功为0，其他为错误码。
     *            "resultMessage": "",    // 取消投屏结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  cancelDuplicateDisplays: function (callback) {
    return window.sstruntime.cancelDuplicateDisplays(jsonStr => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 校验维护管理窗口密码 --
     * @param password
     * @param callback
     * @return {Boolean}
     */
  verifyAdminPassword: function (password, callback) {
    return window.sstruntime.verifyAdminPassword(password, (jsonStr) => { callback(JSON.parse(jsonStr)) })
  }

}
