import { runtimeCoreApi } from './sstruntime-core-api.js'

/**
 * -- Device Generic APIs（设备通用APIs） --
 */
export const deviceGenericApi = {

  /**
     * -- 获取所有设备信息 --
     * @brief
     * @example
     *        if (!terminal.device.getAllDeviceInfos(result => {
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
     *          "resultCode": 0,                     // 获取成功为0，其他为错误码
     *          "resultMessage": "",                 // 结果说明信息
     *          "data": {
     *              "devices": {                     // 设备信息列表
     *                  "{deviceId}": {                 // 设备ID
     *                      "adapterId": "",               // 设备适配器ID
     *                      "instanceId": "",              // 设备对象实例ID
     *                      "displayName": "",             // 设备显示名称
     *                      "categoryInfos": [             // 设备类别信息列表
     *                          {
     *                              "code": 0,                // 设备类别编码
     *                              "name": "",               // 设备类别名称
     *                              "desc": ""                // 设备类别描述
     *                          }
     *                      ]
     *                  }
     *              }
     *           }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getAllDeviceInfos: function (callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetAllDeviceInfos',
      {},
      callback)
  },

  /**
     * -- 获取设备配置 --
     * @brief
     * @example
     *        if (!terminal.device.getConfig(deviceId, result => {
     *            if (result.resultCode === 0) {
     *                // 获取设备配置成功
     *            } else {
     *                // 获取设备配置失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,              // 获取成功为0，其他为错误码
     *          "resultMessage": "",          // 结果说明信息
     *          "data": {
     *            "configInfo": {             // 设备通信端口配置
     *              "enable": true,              // 设备使能标识（启用/禁用）
     *              "adapterId": "",             // 设备适配器ID
     *              "commPortType": "",          // 通信端口类型
     *              "commPortId": 0,             // 通信端口号
     *              "comBaudRate": 9600          // 串口波特率，只有串口方式有效
     *            }
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getConfig: function (deviceId, callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetDeviceConfig',
      { deviceId: deviceId },
      callback)
  },

  /**
     * -- 设置设备配置 --
     * @brief
     * @example
     *        if (!terminal.device.setConfig(deviceId, configInfo, result => {
     *            if (result.resultCode === 0) {
     *                // 设置设备配置成功
     *            } else {
     *                // 设置设备配置失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
     * @param configInfo {Object}
     *        设备配置信息，为JSON字符串，数据结构如下：
     *        {
     *          "enable": true,              // 设备使能标识（启用/禁用）
     *          "adapterId": "",             // 设备适配器ID
     *          "commPortType": "",          // 通信端口类型
     *          "commPortId": 0,             // 通信端口号
     *          "comBaudRate": 9600          // 串口波特率，只有串口方式才传入
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,              // 获取成功为0，其他为错误码
     *          "resultMessage": ""           // 结果说明信息
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  setConfig: function (deviceId, configInfo, callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'SetDeviceConfig',
      {
        deviceId: deviceId,
        configInfo: configInfo
      },
      callback)
  },

  /**
     * -- 获取设备所支持的操作命令 --
     * @brief
     * @example
     *        if (!terminal.device.getCommands(deviceId, result => {
     *            if (result.resultCode === 0) {
     *                // 获取设备所支持的操作命令成功
     *            } else {
     *                // 获取设备所支持的操作命令失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,         // 获取成功为0，其他为错误码
     *          "resultMessage": "",     // 结果说明信息
     *          "data": {
     *            "commands": [
     *              "command_1",
     *              "command_2",
     *              ...
     *            ]
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getCommands: function (deviceId, callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetDeviceCommands',
      { deviceId: deviceId },
      callback)
  },

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
     *        if (!terminal.device.queryStatus(deviceId, result => {
     *            if (result.resultCode === 0) {
     *                // 获取设备状态成功
     *            } else {
     *                // 获取设备状态失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
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
  queryStatus: function (deviceId, callback) {
    return this.exec(deviceId, 'QueryStatus', {}, 2, callback)
  },

  /**
     * -- 重置设备 --
     * @example
     *        if (!terminal.device.reset(deviceId, result => {
     *            if (result.resultCode === 0) {
     *                // 重置设备成功
     *            } else {
     *                // 重置设备失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
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
  reset: function (deviceId, callback) {
    return this.exec(deviceId, 'Reset', {}, 2, callback)
  },

  /**
     * -- 执行设备操作命令 --
     * @example
     *        if (!terminal.device.exec(deviceId, command, argument, timeout, result => {
     *            if (result.resultCode === 0) {
     *                // 执行设备操作命令成功
     *            } else {
     *                // 执行设备操作命令失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param deviceId {String}
     *        设备ID，是运行环境调度设备的凭证。
     * @param command {String}
     *        要执行的设备操作命令。
     * @param argument {Object}
     *        执行设备操作命令所要求的参数。具体数据结构由设备及其操作命令来定义。
     * @param timeout {Number}
     *        设备超时等待时间，单位为毫秒。设备可能在执行其他任务，所以需要设置等待超时。
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
  exec: function (deviceId, command, argument, timeout, callback) {
    return runtimeCoreApi.service.async(
      'deviceService',
      'ExecuteOperation',
      {
        deviceId: deviceId,
        command: command,
        argument: argument
      },
      timeout,
      callback)
  }
}
