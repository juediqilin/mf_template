import { cameraGenericApi } from './sstruntime-camera-api.js'
import { runtimeCoreApi } from './sstruntime-core-api.js'

/**
 * -- Paper Material Camera APIs (高拍仪APIs) --
 */
export const paperMaterialCameraApi = {

  /**
     * -- 默认高拍仪APIs --
     */
  defaultCamera: {
    /**
         * -- 默认高拍仪预览 --
         * @param videoElement {HTMLVideoElement}
         * @param callback {Function}
         * @return {Boolean}
         */
    preview: function (videoElement, callback) {
      return paperMaterialCameraApi.preview(videoElement, 'default', callback)
    }
  },

  /**
     * -- 打开高拍仪摄像头进行预览 --
     * @brief 将高拍仪摄像头的视频流输出到<video/>元素。应用可以执行对<video/>进行截图获取图片。
     * @param videoElement {HTMLVideoElement}
     *        摄像头视频流输出的<video>元素。
     * @param cameraId {String}
     *        高拍仪摄像头ID。默认高拍仪摄像头ID为`default`。
     * @param callback {Function}
     *        打开摄像头结果回调函数对象，接收一个JSON字符串参数，数据结构为：
     *        {
     *          "resultCode": -1,    // 打开成功则值为0，可以提取data字段，否则值为-1.
     *          "resultMessage": "", // 错误说明信息
     *          "data": {
     *            "videoInfo": {
     *              "width": 0,        // 视频流分辨率宽度，注意不是<video>元素的宽度。
     *              "height": 0        // 视频流分辨率高度，注意不是<video>元素的高度。
     *            }
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  preview: function (videoElement, cameraId, callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetPaperMaterialCamera',
      { cameraId: cameraId },
      execResult => {
        if (execResult.resultCode !== 0) {
          // 获取高拍仪配置失败
          callback(execResult)
          return
        }
        // <video/>元素的宽高比，以长边为自适应的调整基准
        const width = videoElement.clientWidth === 0 ? execResult.data.configInfo.resolution.width : videoElement.clientWidth
        const height = videoElement.clientHeight === 0 ? execResult.data.configInfo.resolution.height : videoElement.clientHeight
        const whRatio = width / height
        // 缩放比率，短边根据缩放比率计算实际长度
        const sizeScale = whRatio > 1
          ? execResult.data.configInfo.resolution.width / videoElement.clientWidth
          : execResult.data.configInfo.resolution.height / videoElement.clientHeight
        // 视频流分辨率宽度，根据宽高比计算实际长度。
        const videoWidth = whRatio > 1
          ? execResult.data.configInfo.resolution.width
          : videoElement.clientWidth * sizeScale
        // 视频流分辨率高度，根据宽高比计算实际长度。
        const videoHeight = whRatio > 1
          ? videoElement.clientHeight * sizeScale
          : execResult.data.configInfo.resolution.height
        // 根据指定分辨率打开摄像头
        if (!cameraGenericApi.openWith(videoElement, execResult.data.configInfo.label, videoWidth, videoHeight, callback)) {
          // 调用打开摄像头接口失败
          callback({
            resultCode: -1,
            resultMessage: '调用打开摄像头接口失败'
          })
        }
      })
  },

  /**
     * -- 拍照 --
     * @param videoElement {HTMLVideoElement}
     * @return {HTMLCanvasElement}
     */
  takePicture: function (videoElement) {
    return cameraGenericApi.takePicture(videoElement)
  }

}
