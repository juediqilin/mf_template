/**
 * Fingerprint Scanner APIs (指纹仪)
 */
export const fingerprintScannerApi = {

}

terminal.device.fingerprintScanner = new function () {
  /**
     * -- 获取设备状态 --
     * @brief 获取设备当前实时状态。设备状态码（result.data.status.code）定义如下：
     *        -1 - 设备初始化，未知状态
     *         0 - 设备正常
     *         1 - 设备警告，不影响使用，但需要提示管理维护人员，如打印机缺纸缺墨等
     *         2 - 设备异常，此时设备不可用，应该报告管理维护人员
     *         3 - 设备正忙，正在执行其他任务，提示用户稍后重试
     *         4 - 设备禁用，当此时应该屏蔽对应功能，可以通过配置修改。
     * @example
     *        if (!terminal.device.fingerprintScanner.queryStatus(result => {
     *            if (result.resultCode === 0) {
     *                // 获取设备状态成功
     *            } else {
     *                // 获取设备状态失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,         // 获取成功为0，其他为错误码
     *          "resultMessage": "",     // 结果说明信息
     *          "data": {
     *            "status": {            // 设备状态信息
     *              "code": 0               // 设备状态码
     *              "detail": ""            // 设备状态说明信息
     *            },
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  function queryStatus (callback) {
    return terminal.device.queryStatus('FingerprintScanner', callback)
  }
  this.queryStatus = queryStatus

  /**
     * -- 重置设备 --
     * @example
     *        if (!terminal.device.fingerprintScanner.reset(result => {
     *            if (result.resultCode === 0) {
     *                // 重置设备成功
     *            } else {
     *                // 重置设备失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,         // 重置设备成功为0，其他为错误码
     *          "resultMessage": "",     // 结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  function reset (callback) {
    return terminal.device.reset('FingerprintScanner', callback)
  }
  this.reset = reset

  /**
     * -- 开始扫描 --
     * @example
     *        if (!terminal.device.fingerprintScanner.scan(result => {
     *            if (result.resultCode === 0) {
     *                // 执行设备操作命令成功
     *            } else {
     *                // 执行设备操作命令失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": -1,         // 结果状态码，0表示执行成功，-1为未知错误码，其他值为对应的错误码。
     *          "resultMessage": "",      // 结果说明信息。
     *          "data": {
     *              "imageType": "",      // 指纹图片格式（png、jpg等）
     *              "imageData": ""       // 指纹图片base64数据
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  function scan (callback) {
    return terminal.device.exec('FingerprintScanner', 'StartScanning', {}, 2, callback)
  }
  this.scan = scan

  /**
     * -- 取消扫码 --
     * @example
     *        if (!terminal.device.fingerprintScanner.cancel(result => {
     *            if (result.resultCode === 0) {
     *                // 取消成功
     *            } else {
     *                // 取消失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,         // 获取成功为0，其他为错误码
     *          "resultMessage": ""      // 结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  function cancel (callback) {
    return terminal.device.exec('FingerprintScanner', 'CancelCurrentCommand', {}, 2, callback)
  }
  this.cancel = cancel

  /**
     * -- 指纹对比 --
     * @example
     *        if (!terminal.device.fingerprintScanner.cancel(result => {
     *            if (result.resultCode === 0) {
     *                // 取消成功
     *            } else {
     *                // 取消失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param argument {Object}
     *        {
     *            ""
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,         // 获取成功为0，其他为错误码
     *          "resultMessage": ""      // 结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  function compare (argument, callback) {

  }
  this.compare = compare
}()
