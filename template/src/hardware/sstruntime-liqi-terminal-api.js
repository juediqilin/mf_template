import { runtimeCoreApi } from './sstruntime-core-api.js'

/**
 * -- LIQI Terminal APIs (力麒自助终端终端APIs) --
 */
export const liqiTerminalApi = {

  /**
     * -- 获取网点编号 --
     * @example
     *        if (!terminal.liqi.getOutletCode(result => {
     *            if (0 !== result.resultCode) {
     *                // 获取网点编号失败，通过result.resultMessage获取相关信息
     *                return;
     *            }
     *            // 获取网点编号成功（result.data.outletCode）
     *        })) {
     *            // 调用getOutletCode接口失败
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,             // 执行结果状态码
     *          "resultMessage": "",         // 执行结果附加说明信息
     *          "data": {
     *              "outletCode": ""         // 网点编号
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getOutletCode: function (callback) {
    return runtimeCoreApi.service.exec(
      'liqiTerminalMonitorService',
      'GetOutletCode',
      {},
      callback)
  },

  /**
     * -- 获取终端编号 --
     * @example
     *        if (!terminal.liqi.getTerminalNo(result => {
     *            if (0 !== result.resultCode) {
     *                // 获取终端编号失败，通过result.resultMessage获取相关信息
     *                return;
     *            }
     *            // 获取终端编号成功（result.data.terminalNo）
     *        })) {
     *            // 调用getTerminalNo接口失败
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,             // 执行结果状态码
     *          "resultMessage": "",         // 执行结果附加说明信息
     *          "data": {
     *              "terminalNo": ""         // 终端编号
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  getTerminalNo: function (callback) {
    return runtimeCoreApi.service.exec(
      'liqiTerminalMonitorService',
      'GetTerminalNo',
      {},
      callback)
  }

}
