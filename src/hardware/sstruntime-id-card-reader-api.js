import { deviceGenericApi } from './sstruntime-device-api.js'

/**
 * -- ID Card Reader APIs (身份证阅读器APIs) --
 */
export const idCardReaderApi = {

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
     *        if (!deviceGenericApi.idCardReader.queryStatus(result => {
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
  queryStatus: function (callback) {
    return deviceGenericApi.queryStatus('IDCardReader', callback)
  },

  /**
     * -- 重置设备 --
     * @example
     *        if (!deviceGenericApi.idCardReader.reset(result => {
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
  reset: function (callback) {
    return deviceGenericApi.reset('IDCardReader', callback)
  },

  /**
     * -- 读取身份证信息 --
     * @brief 异步读卡，读取到身份证信息，或者出现无法继续读卡错误才返回。需要调用cancel取消读卡。
     * @example
     *        if (!deviceGenericApi.idCardReader.read(result => {
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
     *        1、中国大陆居民身份证
     *        {
     *          "resultCode": -1,         // 结果状态码，0表示执行成功，-1为未知错误码，其他值为对应的错误码。
     *          "resultMessage": "",      // 结果说明信息。
     *          "data": {
     *            "cardType": 0,          // 卡类型：0-居民身份证
     *            "name": "",             // 姓名
     *            "sex": "",              // 性别
     *            "nation": "",           // 民族
     *            "birthday": "",         // 出生日期(yyyymmdd)
     *            "address": "",          // 户籍地址
     *            "citizenId": "",        // 身份证号
     *            "issueOrgan": "",       // 签发机关
     *            "validStartDate": "",   // 有效起始日期(yyyymmdd)
     *            "validExpireDate": "",  // 有效截止日期(yyyymmdd)
     *            "photo": {              // 图片数据（base64）
     *              "imageType": "jpg",   // 图片格式
     *              "imageData": ""       // 图片base64编码数据
     *            }
     *          }
     *        }
     *        2、港澳台通行证
     *        {
     *          "resultCode": -1,         // 结果状态码，0表示执行成功，-1为未知错误码，其他值为对应的错误码。
     *          "resultMessage": "",      // 结果说明信息。
     *          "data": {
     *          "cardType": 2,          // 卡类型：2-港澳台通行证
     *            "name": "",             // 姓名
     *            "sex": "",              // 性别
     *            "birthday": "",         // 出生日期(yyyymmdd)
     *            "address": "",          // 户籍地址
     *            "citizenId": "",        // 身份证号
     *            "passportId": "",       // 通行证号
     *            "issueOrgan": "",       // 签发机关
     *            "issueCount": "",       // 签发次数
     *            "validStartDate": "",   // 有效起始日期(yyyymmdd)
     *            "validExpireDate": "",  // 有效截止日期(yyyymmdd)
     *            "credType": "",         // 证件类型：J
     *            "photo": {              // 图片数据（base64）
     *              "imageType": "jpg",   // 图片格式
     *              "imageData": ""       // 图片base64编码数据
     *            }
     *          }
     *        }
     *        3、外国人居留证
     *        {
     *          "resultCode": -1,         // 结果状态码，0表示执行成功，-1为未知错误码，其他值为对应的错误码。
     *          "resultMessage": "",      // 结果说明信息。
     *          "data": {
     *            "cardType": 1,          // 卡类型：1-外国人居留证
     *            "name": "",             // 英文本名
     *            "cnName": "",           // 中文名
     *            "birthday": "",         // 出生日期(yyyymmdd)
     *            "residenceId": "",      // 居留证号
     *            "regionCode": "",       // 国籍区域代码
     *            "nationality": "",      // 国籍
     *            "validStartDate": "",   // 有效起始日期(yyyymmdd)
     *            "validExpireDate": "",  // 有效截止日期(yyyymmdd)
     *            "version": "",          // 证件版本号
     *            "issueOrgan": "",       // 签证机关
     *            "credType": "",         // 证件类型：I
     *            "photo": {              // 图片数据（base64）
     *              "imageType": "jpg",   // 图片格式
     *              "imageData": ""       // 图片base64编码数据
     *            }
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  read: function (callback) {
    // 离开当前页面时，取消读卡
    $(window).bind('beforeunload', function () {
      idCardReaderApi.cancel((result) => {
        if (result.resultCode !== 0) {
          console.log('离开页面时取消读取身份证失败：' + result.resultMessage)
        }
      })
    })
    // 执行读取身份证信息
    return deviceGenericApi.exec('IDCardReader', 'ReadIDCard', {}, 2, callback)
  },

  /**
     * -- 取消异步读取身份证 --
     * @example
     *        if (!deviceGenericApi.idCardReader.cancel(result => {
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
  cancel: function (callback) {
    return deviceGenericApi.exec('IDCardReader', 'CancelCurrentCommand', {}, 2, callback)
  }

}
