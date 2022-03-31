import { cameraGenericApi } from './sstruntime-camera-api.js'
import { runtimeCoreApi } from './sstruntime-core-api.js'

/**
 * -- Face Detection APIs（人脸识别APIs）--
 */
export const faceDetectionApi = {

  /**
     * -- 默认人脸识别摄像头APIs --
     */
  defaultCamera: {
    /**
         * -- 打开默认人脸识别摄像头进行预览 --
         * @param videoElement
         * @param callback
         * @return {Boolean}
         */
    preview: function (videoElement, callback) {
      return faceDetectionApi.preview(videoElement, 'default', callback)
    }
  },

  /**
     * -- 打开人脸识别摄像头进行预览 --
     * @brief 将人脸识别摄像头的视频流输出到<video/>元素。应用可以执行对<video/>进行截图获取图片。
     *        该接口只是单纯地打开人脸识别摄像头进行预览，不会跟踪监测和采集人脸图片。
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
      'GetFaceDetectionCamera',
      { cameraId: cameraId },
      execResult => {
        if (execResult.resultCode !== 0) {
          // 获取人脸摄像头配置失败
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
        if (!cameraGenericApi.openWith(videoElement, execResult.data.configInfo.cameras.rgb, videoWidth, videoHeight, callback)) {
          // 调用打开摄像头接口失败
          callback({
            resultCode: -1,
            resultMessage: '调用打开摄像头接口失败'
          })
        }
      })
  },

  /**
     * -- 单人脸检测 --
     * @brief 打开指定的摄像头模组，将摄像头模组的RGB彩色摄像头视频流输出到标签id为videoElementId
     *        的<video/>元素。同时截取视频流的帧数据，发送给运行环境内核进行人脸和活体检测，如果检测
     *        到活体人脸，并且人脸在指定的矩形框区域内，则截取并返回人脸数据。
     * @attention
     *        【注意】
     *        打开的摄像头视频流分辨率和<video/>元素的尺寸是一致的，因此页面必须设置<video/>元素的尺寸大小。
     * @param moduleId {String}
     *        人脸识别摄像头模组ID，用来标识调用哪一个摄像头模组。例如，前置人脸识别摄像头模组ID可以
     *        设置为`frontFaceCamera`，后置人脸识别摄像头模组ID可以设置为`backFaceCamera`。
     *        具体摄像头模组ID根据业务场景协定，并在客户端配置后即可以调用。
     * @param videoElement {HTMLVideoElement}
     *        输出摄像头视频流的页面<video/>元素id。
     * @param x {Number}
     *        指定矩形框区域【相对于<video/>元素】x坐标。
     * @param y {Number}
     *        指定矩形框区域【相对于<video/>元素】的y坐标。
     * @param w {Number}
     *        指定矩形框区域【相对于<video/>元素】的分辨率宽度。
     * @param h {Number}
     *        指定矩形框区域【相对于<video/>元素】的分辨率高度。
     * @param callback {Function}
     *        检测结果回调函数对象。函数接收一个参数，且该参数为json字符串。
     *        {
     *            "resultCode": 0,
     *            "resultMessage": "",
     *            "data": {
     *                "imageType": "png, jpg..."
     *                "imageData": "base64图片数据"
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  detectSingleFace: function (moduleId, videoElement, x, y, w, h, callback) {
    // 人脸检测结果码
    const FACE_NOT_SAME = 110002 // 多张图片检测不是同一个人
    const FACE_NOT_FOUND = 110001 // 没有检测到人脸
    const FACE_NOT_ALIVE = 110004 // 检测到的不是活体人脸
    const FACE_NOT_IN_RECT = 110003 // 检测到的人脸没有在矩形框区域内
    // base64图片url正则表达式，用于提取base64图片数据和图片类型
    const imageBase64RegExp = new RegExp('data:image/(\\w+);base64,(.+)')

    let rgbCameraLabel // RGB（可见光）摄像头，必须项
    let rgbCameraDeviceId
    let rgbImageCanvas
    const rgbVideoElement = videoElement

    let nirCameraLabel // NIR（近红外）摄像头
    let nirCameraDeviceId
    let nirImageCanvas
    let nirVideoElement

    let threedslCameraLabel // 3DSL（3D结构光）摄像头
    let threedslCameraDeviceId
    let threedslImageCanvas
    let threedslVideoElement

    console.info('Try to process single face detection...')
    // 获取摄像头模组配置参数，根据配置参数打开摄像头（RGB[must], NIR[optional], Threedsl[optional]）
    const getConfigArgs = {
      moduleId: moduleId
    }
    return runtimeCoreApi.service.exec('faceDetectionService', 'GetCameraModuleConfig', JSON.stringify(getConfigArgs), jsonStr => {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 获取摄像头模组配置参数失败
        console.log('Retrieve configuration of camera module [' + moduleId + '] unsuccessfully: ' + result.resultMessage)
        callback(jsonStr)
        return
      }
      // 获取摄像头模组配置参数成功
      console.info('Configuration of camera module [' + moduleId + '] is found.\n' +
                JSON.stringify(result.data.config, null, '\t'))
      rgbCameraLabel = result.data.config.cameras.rgb
      if (result.data.config.mode > 2) nirCameraLabel = result.data.config.cameras.nir
      if (result.data.config.mode > 4) threedslCameraLabel = result.data.config.cameras.threedsl
      // 查找RGB摄像头
      findRgbCamera()
    })

    /**
         * -- 查找RGB摄像头 --
         */
    function findRgbCamera () {
      console.info('Try to find RGB camera [' + rgbCameraLabel + ']...')
      if (!terminal.camera.find(rgbCameraLabel, findRgbCameraCallback)) {
        // 调用获取摄像头列表接口失败
        console.log('Invoke interface of finding camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用获取摄像头列表接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 查找RGB摄像头回调函数 --
         * @param jsonStr
         */
    function findRgbCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 没有找到RGB摄像头
        console.log('RGB camera [' + rgbCameraLabel + '] is not found.')
        callback(jsonStr)
        return
      }
      // 保存RGB摄像头的设备ID
      rgbCameraDeviceId = result.data.deviceId
      console.info('RGB camera [' + rgbCameraLabel + '] is found.')
      // 查看是否需要查找其他摄像头
      if (undefined !== nirCameraLabel) {
        // 有设置NIR摄像头，进行查找
        findNirCamera()
      } else if (undefined !== threedslCameraLabel) {
        // 有设置3DSL摄像头，进行查找
        findThreedslCamera()
      } else {
        // 没有其他摄像头需要查找了，打开RGB摄像头
        openRgbCamera()
      }
    }

    /**
         * -- 查找NIR摄像头 --
         */
    function findNirCamera () {
      console.info('Try to find NIR camera [' + nirCameraLabel + ']...')
      if (!terminal.camera.find(nirCameraLabel, findNirCameraCallback)) {
        // 调用查找摄像头接口失败
        console.log('Invoke interface of finding camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用查找摄像头接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 查找NIR摄像头回调函数 --
         * @param jsonStr
         */
    function findNirCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 没有找到NIR摄像头
        console.log('NIR camera [' + nirCameraLabel + '] is not found.')
        callback(jsonStr)
        return
      }
      // 保存NIR摄像头的设备ID
      nirCameraDeviceId = result.data.deviceId
      console.info('NIR camera [' + nirCameraLabel + '] is found.')
      // 查看是否需要查找其他摄像头
      if (undefined !== threedslCameraLabel) {
        // 有设置3DSL摄像头，进行查找
        findThreedslCamera()
      } else {
        // 没有其他摄像头需要查找了，打开RGB摄像头
        openRgbCamera()
      }
    }

    /**
         * -- 查找3DSL摄像头 --
         */
    function findThreedslCamera () {
      console.info('Try to find 3dSL camera [' + threedslCameraLabel + ']...')
      if (!terminal.camera.find(threedslCameraLabel, findThreedslCameraCallback)) {
        // 调用查找摄像头接口失败
        console.log('Invoke interface of finding camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用查找摄像头接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 查找3DSL摄像头回调函数 --
         * @param jsonStr
         */
    function findThreedslCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 没有找到3DSL摄像头
        console.log('3DSL camera [' + threedslCameraLabel + '] is not found.')
        callback(jsonStr)
        return
      }
      // 保存3DSL摄像头的设备ID
      threedslCameraDeviceId = result.data.deviceId
      console.info('3DSL camera [' + threedslCameraLabel + '] is found.')
      // 没有其他摄像头需要查找了，打开RGB摄像头
      openRgbCamera()
    }

    /**
         * -- 打开RGB摄像头 --
         */
    function openRgbCamera () {
      console.info('Try to open RGB camera [' + rgbCameraLabel + ']...')
      if (!terminal.camera.openDefaultWidth(rgbVideoElement, rgbCameraDeviceId, openRgbCameraCallback)) {
        // 调用打开摄像头接口失败
        console.log('Invoke interface of opening camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用打开摄像头接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 打开RGB摄像头回调函数 --
         * @param jsonStr
         */
    function openRgbCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 打开RGB摄像头失败
        console.log('Open RGB camera [' + rgbCameraLabel + '] unsuccessfully: ' + result.resultMessage)
        callback(jsonStr)
        return
      }
      // 打开RGB摄像头成功，创建对应canvas。
      rgbImageCanvas = document.createElement('canvas')
      rgbImageCanvas.width = rgbVideoElement.videoWidth
      rgbImageCanvas.height = rgbVideoElement.videoHeight
      // 查看是否需要打开其他摄像头，否则进行检测处理
      if (undefined !== nirCameraLabel) {
        // 有设置NIR摄像头，打开摄像头
        openNirCamera()
      } else if (undefined !== threedslCameraLabel) {
        // 有设置3DSL摄像头，打开摄像头
        openThreedslCamera()
      } else {
        // 不用打开其他摄像头了，进行检测处理
        console.info('No other cameras to open, start processing detection...')
        processDetection()
      }
    }

    /**
         * -- 打开NIR摄像头 --
         */
    function openNirCamera () {
      console.info('Try to open NIR camera [' + nirCameraLabel + ']...')
      nirVideoElement = document.createElement('video')
      document.body.appendChild(nirVideoElement)
      nirVideoElement.setAttribute('hidden', '')
      nirVideoElement.clientWidth = rgbVideoElement.clientWidth
      nirVideoElement.clientHeight = rgbVideoElement.clientHeight
      if (!terminal.camera.openDefaultWidth(nirVideoElement, nirCameraDeviceId, openNirCameraCallback)) {
        // 调用打开摄像头接口失败
        console.log('Invoke interface of opening camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用打开摄像头接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 打开NIR摄像头回调函数 --
         * @param jsonStr
         */
    function openNirCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 打开NIR摄像头失败
        console.log('Open NIR camera [' + nirCameraLabel + '] unsuccessfully: ' + result.resultMessage)
        callback(jsonStr)
        return
      }
      // 打开NIR摄像头成功，创建对应canvas。
      nirImageCanvas = document.createElement('canvas')
      nirImageCanvas.width = nirVideoElement.videoWidth
      nirImageCanvas.height = nirVideoElement.videoHeight
      // 查看是否需要打开其他摄像头，否则进行检测处理
      if (undefined !== threedslCameraLabel) {
        // 有设置3DSL摄像头
        openThreedslCamera()
      } else {
        // 不用打开其他摄像头了，进行检测处理
        console.info('No other cameras to open, start processing detection...')
        processDetection()
      }
    }

    /**
         * -- 打开3DSL摄像头 --
         */
    function openThreedslCamera () {
      console.info('Try to open 3DSL camera [' + threedslCameraLabel + ']...')
      threedslVideoElement = document.createElement('video')
      threedslVideoElement.setAttribute('hidden', '')
      threedslVideoElement.clientWidth = rgbVideoElement.clientWidth
      threedslVideoElement.clientHeight = rgbVideoElement.clientHeight
      if (!terminal.camera.openDefaultWidth(threedslVideoElement, threedslCameraDeviceId, openThreedslCameraCallback)) {
        // 调用打开摄像头接口失败
        console.log('Invoke interface of opening camera unsuccessfully.')
        const result = {
          resultCode: -1,
          resultMessage: '调用打开摄像头接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 打开3DSL摄像头回调函数 --
         * @param jsonStr
         */
    function openThreedslCameraCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== 0) {
        // 打开3DSL摄像头失败
        console.log('Open 3DSL camera [' + nirCameraLabel + '] unsuccessfully: ' + result.resultMessage)
        callback(jsonStr)
        return
      }
      // 打开3DSL摄像头成功，创建对应canvas。
      threedslImageCanvas = document.createElement('canvas')
      threedslImageCanvas.width = threedslVideoElement.videoWidth
      threedslImageCanvas.height = threedslVideoElement.videoHeight
      // 不用打开其他摄像头了，进行检测处理
      console.info('No other cameras to open, start processing detection...')
      processDetection()
    }

    /**
         * -- 处理人脸检测 --
         */
    function processDetection () {
      const wRectScale = rgbVideoElement.videoWidth / rgbVideoElement.clientWidth // 宽度放缩比例
      const hRectScale = rgbVideoElement.videoHeight / rgbVideoElement.clientHeight// 高度放缩比例
      const detectArgs = {
        faceRect: { // 人脸矩形框区域参数
          x: x * wRectScale,
          y: y * hRectScale,
          w: w * wRectScale,
          h: h * hRectScale
        },
        imageInfos: {} // 要检测的图片参数
      }
      // RGB图片参数
      rgbImageCanvas.getContext('2d').drawImage(rgbVideoElement,
        0, 0, rgbVideoElement.videoWidth, rgbVideoElement.videoHeight)
      const rgbImageMatchArr = imageBase64RegExp[Symbol.match](rgbImageCanvas.toDataURL())
      detectArgs.imageInfos.rgb = {
        type: rgbImageMatchArr[1],
        data: rgbImageMatchArr[2]
      }
      // NIR图片参数
      if (undefined !== nirImageCanvas) {
        nirImageCanvas.getContext('2d').drawImage(nirVideoElement,
          0, 0, nirVideoElement.videoWidth, nirVideoElement.videoHeight)
        const nirImageMatchArr = imageBase64RegExp[Symbol.match](nirImageCanvas.toDataURL())
        detectArgs.imageInfos.nir = {
          type: nirImageMatchArr[1],
          data: nirImageMatchArr[2]
        }
      }
      // 3DSL图片参数
      if (undefined !== threedslImageCanvas) {
        threedslImageCanvas.getContext('2d').drawImage(threedslVideoElement,
          0, 0, threedslVideoElement.videoWidth, threedslVideoElement.videoHeight)
        const threedslImageMatchArr = imageBase64RegExp[Symbol.match](threedslImageCanvas.toDataURL())
        detectArgs.imageInfos.threedsl = {
          type: threedslImageMatchArr[1],
          data: threedslImageMatchArr[2]
        }
      }
      //* 记录人脸识别框大小和位置信息
      console.log('Face rectangle information:\n' + JSON.stringify(detectArgs.faceRect, null, '\t'))
      //* /
      /* 记录人脸识别接口调用参数
            console.log(JSON.stringify(detectArgs, null, '\t'));
            // */
      if (!terminal.service.asynExec('generalFaceDetectionService', 'DetectSingleFace',
        JSON.stringify(detectArgs), 2000, processDetectionCallback)) {
        // 调用人脸检测接口失败
        const result = {
          resultCode: -1,
          resultMessage: '调用人脸检测服务接口失败'
        }
        callback(JSON.stringify(result))
      }
    }

    /**
         * -- 人脸检测处理回调函数 --
         * @param jsonStr
         */
    function processDetectionCallback (jsonStr) {
      const result = JSON.parse(jsonStr)
      if (result.resultCode !== FACE_DETECT_NONE &&
                result.resultCode !== FACE_DETECT_NOT_ONE &&
                result.resultCode !== FACE_DETECT_NOT_LIVING &&
                result.resultCode !== FACE_DETECT_NOT_IN_RECT) {
        // 不是以上错误码，不应该继续进行检测。成功的话返回人脸图片数据，失败的话则是对应其他错误码。
        callback(jsonStr)
        return
      }
      processDetection()
    }
  }

}
