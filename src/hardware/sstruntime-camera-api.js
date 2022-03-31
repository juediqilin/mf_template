/**
 * -- Camera Generic APIs（摄像头通用APIs） --
 */
export const cameraGenericApi = {
  // 默认宽度
  DEFAULT_VIDEO_WIDTH: 720,
  // 默认高度
  DEFAULT_VIDEO_HEIGHT: 480,
  // 摄像头列表
  cameras: null,

  /**
     * -- 列出所有的摄像头 --
     * @brief
     * @example
     *        if (!terminal.camera.list(result => {
     *            if (result.resultCode === 0) {
     *                // 列出所有的摄像头成功
     *            } else {
     *                // 列出所有的摄像头失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,
     *          "resultMessage": "",
     *          "data": {
     *            "cameras": {
     *                "deviceId_1": "label_1",
     *                "deviceId_2": "label_2",
     *                ...
     *            }
     *          }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  list: function (callback) {
    if (!this.cameras) { // 还没获取摄像头列表，枚举多媒体设备进行获取
      // 遍历所有的媒体设备
      navigator.mediaDevices.enumerateDevices()
        .then(deviceInfos => {
          let cameraIndex = 0
          this.cameras = {}
          // 遍历所有的媒体设备，筛选出摄像头
          $.each(deviceInfos, function (index, value) {
            if (value.kind !== 'videoinput') return// 不是摄像头，跳过
            if (value.label === '') {
              // 获取到的摄像头label属性为空，说明浏览器没有获取到媒体流权限
              console.warn('Label of camera(deviceId=' + value.deviceId + ') is empty.')
              return
            }
            // 获取到摄像头信息（摄像头名称和当前DOM中的设备ID）
            cameraIndex++// 计数器递增，作为摄像头的编号ID
            cameraGenericApi.cameras[value.deviceId] = cameraIndex + '. ' + value.label
            console.log('Camera[' + cameraGenericApi.cameras[value.deviceId] + '] is found.')
          })
          callback({
            resultCode: 0,
            resultMessage: '获取摄像头列表成功',
            data: {
              cameras: cameraGenericApi.cameras
            }
          })
        })
        .catch(error => {
          // 枚举设备异常
          console.error('Retrieve device information of cameras error: ' + error.message)
          callback({
            resultCode: -1,
            resultMessage: error.message
          })
        })
    } else {
      callback({
        resultCode: 0,
        resultMessage: '获取摄像头列表成功',
        data: {
          cameras: this.cameras
        }
      })
    }
    return true
  },

  /**
     * -- 根据摄像头名称查找摄像头 --
     * @brief 如果查找成功的话，返回摄像头的设备ID（deviceId）。
     * @example
     *        if (!terminal.camera.find(cameraLabel, result => {
     *            if (result.resultCode === 0) {
     *                // 列出所有的摄像头成功
     *            } else {
     *                // 列出所有的摄像头失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param cameraLabel {string}
     *        摄像头Label
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": 0,
     *          "resultMessage": "",
     *          "data": {
     *            "deviceId": ""
     *          }
     *        }
     */
  find: function (cameraLabel, callback) {
    return this.list(result => {
      if (result.resultCode !== 0) {
        // 获取摄像头列表失败
        callback(result)
        return
      }
      let isFound = false
      $.each(result.data.cameras, (deviceId, label) => {
        if (label === cameraLabel) { // 找到了指定的摄像头，回调
          isFound = true// 标记为已经找到
          callback({
            resultCode: 0,
            resultMessage: '找到摄像头',
            data: {
              deviceId: deviceId
            }
          })
        }
      })
      if (!isFound) {
        console.error('Camera[' + cameraLabel + '] is not found.')
        callback({
          resultCode: -1,
          resultMessage: '没有找到指定摄像头'
        })
      }
    })
  },

  /**
     * -- 打开摄像头 --
     * @brief 打开的摄像头分辨率等同于<video/>元素的尺寸。
     * @param videoElement {HTMLVideoElement}
     * @param cameraLabel {String}
     * @param callback {Function}
     * @return {Boolean}
     */
  open: function (videoElement, cameraLabel, callback) {
    return this.openWith(videoElement, cameraLabel, videoElement.clientWidth, videoElement.clientHeight, callback)
  },

  /**
     * -- 指定分辨率打开摄像头 --
     * @example
     *        if (!terminal.camera.openWith(videoElement, 'cameraLabel', 680, 480, result => {
     *            if (result.resultCode === 0) {
     *                // 打开摄像头成功
     *            } else {
     *                // 打开摄像头失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param videoElement {HTMLVideoElement}
     *        摄像头视频流要输出的<video/>元素
     * @param cameraLabel {String}
     *        要打开的摄像头Label
     * @param width {Number}
     *        摄像头分辨率宽度
     * @param height {Number}
     *        摄像头分辨率高度
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": -1,     // 如果打开成功则为0，否则为-1
     *          "resultMessage": "",  // 错误说明信息
     *          "data": {
     *            "videoInfo": {      // 视频流的参数信息
     *                "width": 0,        // 视频的分辨率宽度
     *                "height": 0        // 视频的分辨率高度
     *            }
     *          }
     *        }
     * @return {Boolean}
     */
  openWith: function (videoElement, cameraLabel, width, height, callback) {
    // 停止<video/>元素的多媒体流
    this.stopVideoStream(videoElement)

    // 先查找cameraLabel对应对摄像头（需要设备ID）
    return this.find(cameraLabel, findResult => {
      if (findResult.resultCode !== 0) {
        // 找不到指定的摄像头
        callback(findResult)
        return
      }

      // <video/>元素需要这两个属性才能自动播放摄像头输出的视频流，这里添加是避免页面开发者忘记了
      videoElement.setAttribute('autoplay', 'autoplay')
      videoElement.setAttribute('playsinline', 'playsinline')

      // 设定要打开的摄像头约束，指定分辨率
      const constraints = {
        video: {
          width: width,
          height: height,
          deviceId: findResult.data.deviceId
        }
      }
      // 打开摄像头，并将媒体流输出到<video/>元素
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const videoTracks = stream.getVideoTracks()
          for (let i = 0; i < videoTracks.length; i++) { // 遍历<video/>元素的视频流轨道，找到指定摄像头对应的视频流
            const settings = videoTracks[i].getSettings()
            if (settings.deviceId === findResult.data.deviceId) { // 找到了，播放视频流
              playVideoStream(videoElement, stream, settings, cameraLabel, callback)
              break
            }
          }
        })
        .catch(error => { // 打开摄像头失败，发生错误
          console.error('Open camera[' + cameraLabel + '] error: ' + error.message)
          callback({
            resultCode: -1,
            resultMessage: error.message
          })
        })
    })
  },

  /**
     * -- 根据默认的分辨率打开摄像头 --
     * @brief 默认分辨率的宽度固定为720，分辨率高度根据<video/>元素的尺寸进行等比放缩得到。
     * @example
     *        if (!terminal.camera.openDefaultWidth(videoElement, 'cameraLabel', result => {
     *            if (result.resultCode === 0) {
     *                // 打开摄像头成功
     *            } else {
     *                // 打开摄像头失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param videoElement {HTMLVideoElement}
     *        摄像头视频流要输出的<video/>元素
     * @param cameraLabel {String}
     *        要打开的摄像头Label
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": -1,     // 如果打开成功则为0，否则为-1
     *          "resultMessage": "",  // 错误说明信息
     *          "data": {
     *            "videoInfo": {      // 视频流的参数信息
     *                "width": 0,        // 视频的分辨率宽度
     *                "height": 0        // 视频的分辨率高度
     *            }
     *          }
     *        }
     * @return {Boolean}
     */
  openDefaultWidth: function (videoElement, cameraLabel, callback) {
    // 放缩比例，如果videoElement.clientWidth为0的话，则设为默认分辨率宽度
    const videoSizeScale = cameraGenericApi.DEFAULT_VIDEO_WIDTH / (videoElement.clientWidth === 0 ? cameraGenericApi.DEFAULT_VIDEO_WIDTH : videoElement.clientWidth)
    const videoHeight = (videoElement.clientHeight === 0 ? cameraGenericApi.DEFAULT_VIDEO_HEIGHT : videoElement.clientHeight) * videoSizeScale

    return this.openWith(videoElement, cameraLabel, cameraGenericApi.DEFAULT_VIDEO_WIDTH, videoHeight, callback)
  },

  /**
     * --  --
     * @param videoElement
     * @param cameraLabel
     * @param callback
     * @return {Boolean}
     */
  openDefaultHeight: function (videoElement, cameraLabel, callback) {
    // 放缩比例，如果videoElement.clientHeight为0的话，则设为默认分辨率高度
    const videoSizeScale = cameraGenericApi.DEFAULT_VIDEO_HEIGHT / (videoElement.clientHeight === 0 ? cameraGenericApi.DEFAULT_VIDEO_HEIGHT : videoElement.clientHeight)
    const videoWidth = (videoElement.clientWidth === 0 ? cameraGenericApi.DEFAULT_VIDEO_WIDTH : videoElement.clientWidth) * videoSizeScale

    return this.openWith(videoElement, cameraLabel, videoWidth, cameraGenericApi.DEFAULT_VIDEO_HEIGHT, callback)
  },

  /**
     * -- 根据摄像头所支持的最大分辨率打开摄像头 --
     * @example
     *        if (!terminal.camera.openMaxSolution(videoElement, 'cameraLabel', result => {
     *            if (result.resultCode === 0) {
     *                // 打开摄像头成功
     *            } else {
     *                // 打开摄像头失败
     *            }
     *        })) {
     *            // 执行JS接口失败，进行失败处理
     *        }
     * @param videoElement {HTMLVideoElement}
     *        摄像头视频流要输出的<video/>元素
     * @param cameraLabel {String}
     *        要打开的摄像头Label
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *          "resultCode": -1,     // 如果打开成功则为0，否则为-1
     *          "resultMessage": "",  // 错误说明信息
     *          "data": {
     *            "videoInfo": {      // 视频流的参数信息
     *                "width": 0,        // 视频的分辨率宽度
     *                "height": 0        // 视频的分辨率高度
     *            }
     *          }
     *        }
     * @return {Boolean}
     */
  openMaxSolution: function (videoElement, cameraLabel, callback) {
    // 停止已有媒体流的播放
    this.stopVideoStream(videoElement)

    // 先查找cameraLabel对应的设备ID
    return this.find(cameraLabel, result => {
      if (result.resultCode !== 0) {
        callback(result)
        return
      }

      // <video/>元素需要这两个属性才能自动播放摄像头输出的视频流，这里添加是避免页面开发者忘记了
      videoElement.setAttribute('autoplay', 'autoplay')
      videoElement.setAttribute('playsinline', 'autoplay')

      // 打开摄像头，并将媒体流输出到<video/>元素
      navigator.mediaDevices.getUserMedia({ video: { deviceId: result.data.deviceId } })
        .then(stream => {
          const videoTracks = stream.getVideoTracks()
          for (let i = 0; i < videoTracks.length; i++) { // 遍历<video/>元素的视频流轨道，找到指定摄像头对应的视频流
            const capabilities = videoTracks[i].getCapabilities()
            if (capabilities.deviceId === result.data.deviceId) { // 找到了，调整分辨率为<video/>元素的宽度，高度自动
              videoTracks[i].applyConstraints({
                width: capabilities.width.max,
                height: capabilities.height.max
              }).then(() => {
                playVideoStream(videoElement, stream, videoTracks[i].getSettings(), cameraLabel, callback)
              }).catch(error => {
                console.error('Adjust solution of camera video stream error: ' + error.message)
                this.stopVideoStream(videoElement)// 停止媒体流的播放
                callback({
                  resultCode: -1,
                  resultMessage: error.message
                })
              })
              break
            }
          }
        })
        .catch(error => { // 打开摄像头失败，发生错误
          console.error('Open camera[' + cameraLabel + '] error: ' + error.message)
          callback({
            resultCode: -1,
            resultMessage: error.message
          })
        })
    })
  },

  /**
     * -- 停止媒体流的播放 --
     * @param videoElement {HTMLVideoElement}
     */
  stopVideoStream: function (videoElement) {
    if (videoElement.srcObject) {
      // 媒体流绑定到<video/>标签元素上，如果已经有绑定的媒体流，先停止媒体流的输出
      videoElement.srcObject.getTracks().forEach(track => {
        track.stop()
      })
    }
    videoElement.srcObject = null
  },

  /**
     * -- 获取视频流帧图片 --
     * @brief 返回的是一个canvas元素，具体如何使用由应用决定。
     * @example
     *        // 把获取到的图片显示到<img id="picturePreview">元素上
     *        $('#picturePreview').attr('src', terminal.camera.takePicture(videoElement).toDataURL('image/png'));
     * @param videoElement {HTMLVideoElement}
     * @return {HTMLCanvasElement}
     */
  takePicture: function (videoElement) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = videoElement.videoWidth
    canvasElement.height = videoElement.videoHeight
    canvasElement.getContext('2d').drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight)
    return canvasElement
  }

}

/**
 * -- 开始播放视频流 --
 * @param videoElement {HTMLVideoElement}
 * @param stream {MediaStream}
 * @param settings {MediaTrackSettings}
 * @param cameraLabel {String}
 * @param callback {Function}
 */
function playVideoStream (videoElement, stream, settings, cameraLabel, callback) {
  videoElement.onplay = () => { // 视频流开始播放之后再回调，防止视频流输出前读取帧数据
    const result = {
      resultCode: 0,
      resultMessage: '打开摄像头成功',
      data: {
        videoInfo: {
          width: settings.width,
          height: settings.height
        }
      }
    }
    console.log('Open camera[' + cameraLabel + '] successfully.\n' +
            JSON.stringify(result, null, '\t'))
    callback(result)
  }
  videoElement.srcObject = stream // 设置完分辨率之后再输出到<video/>元素，否则会出现影像卡屏
}
