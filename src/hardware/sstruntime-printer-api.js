import { runtimeCoreApi } from './sstruntime-core-api.js'

/**
 * -- Generic Printer APIs (通用系统打印机APIs) --
 */
export const genericPrinterApi = {

  /**
     * -- 列举所有系统打印机名称 --
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,              // 执行成功为0，其他为错误码
     *            "resultMessage": "",          // 执行结果说明信息
     *            "data": {
     *                "defaultPrinter": "",     // 默认打印机名称
     *                "printers": [             // 打印机名称数组
     *                    "printer_name_1",
     *                    "printer_name_2"
     *                ]
     *            }
     *        }
     * @return {Boolean}
     *       返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *       返回false则表示运行环境处理JS接口调用失败。
     */
  list: function (callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetAllPrinters',
      {},
      callback)
  },

  /**
     * -- 获取默认打印机 --
     * @example
     *        if (!terminal.device.printer.getDefaultPrinter(result => {
     *            if (result.resultCode !== 0) {
     *                // 获取默认打印机失败
     *                return;
     *            }
     *            // 获取默认打印机成功
     *        }) {
     *            // 调用接口失败
     *        }
     * @param callback {Function}
     *        回调函数对象，参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,              // 执行成功为0，其他为错误码
     *            "resultMessage": "",          // 执行结果说明信息
     *            "data": {
     *                "printer": "",            // 默认打印机名称
     *            }
     *        }
     * @return {Boolean}
     */
  getDefaultPrinter: function (callback) {
    return runtimeCoreApi.service.exec(
      'deviceService',
      'GetDefaultPrinter',
      {},
      callback)
  },

  /**
     * -- 打印页面 --
     * @brief 打印调用该接口的当前页面。如果要打印整个页面，则argument参数可以为null，此时打印属性取默认值。
     *        如果要打印页面中指定的某个DOM元素，则参数argument.printTask.id字段取要打印的元素id值。
     *        【注意】
     *          1. 要打印的页面内容不能包含iframe，否则会导致打印内容不全，甚至空白。
     *          2. 在callback回调被调用之前，页面内容不能变动，否则会导致打印内容篡改。
     *             callback回调可能被多次调用，根据具体返回的resultCode进行处理。
     *             详情参考callback参数说明。
     * @param argument {Object}
     *        {
     *            "printProperties": {                  // 打印属性，如果没有设置，或者值无效，则自动取默认值。
     *                "printerName": "",                   // 系统打印机名称
     *                                                        // 默认打印机通过配置获取
     *                "paperType": 40,                     // 纸张类型
     *                                                        // 30: A3
     *                                                        // 40: A4（默认）
     *                                                        // 50: A5
     *                "isRotated": false,                  // 纸张方向
     *                                                        // true:  横向
     *                                                        // false: 纵向（默认）
     *                "isColorful": false,                 // 打印颜色
     *                                                        // true:  彩色
     *                                                        // false: 黑白（默认）
     *                "duplexMode": 0                      // 双面模式
     *                                                        // 0: 单面（默认）
     *                                                        // 1: 纵向双面（横向翻页）
     *                                                        // 2: 横向双面（纵向翻页）
     *            },
     *            "printTask": {                        // 打印任务参数
     *                "id": ""                             // 要打印的页面元素，如果没有设置，或者为空字符串，则打印整个页面
     *            }
     *        }
     * @param callback {Function}
     *        回调函数对象。打印过程会多次回调，通知打印任务状态。参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,          // 打印成功则为0，其他为错误码或者提示码，提示码(130000~139999)如下：
     *                                         // 130001 - 警告提示，可能打印机缺纸、缺墨等
     *                                         // 130007 - 错误提示，打印机出错或者打印任务出错
     *                                         // 130009 - 通知提示，通知打印任务的执行状态。
     *            "resultMessage": ""       // 执行结果说明信息/提示信息
     *            "data": {
     *                "leftDocs": 0,        // 剩余打印文档数（预留字段）
     *                                         // 包含当前正在打印的文档。
     *                "leftPages": 0,       // 剩余打印页数（预留字段）
     *                                         // 包含当前正在打印的页面。当剩余打印页数为0时，则表示所有文档已经发送给打印机
     *                                         // 进行打印，但不一定出纸。当打印机缺纸或者缺墨时，打印数据只是发送给了打印机，
     *                                         // 系统无法跟踪打印机的实时打印状态（除非打印机驱动支持将打印机状态反馈给系统），
     *                                         // 因此有没有打印出纸，需要根据现场实际情况判定，这里通过应用无法进行检测。
     *                "currentDoc": "",     // 当前打印文档（预留字段）
     *                                         // 当前正在打印的文档名称，不包含后缀。客户端只负责传回提取到的文档名称，
     *                                         // 至于文档名称的可读性需要上层应用自行负责。
     *                "totalLeftPages": 0,  // 总的剩余打印页数（预留字段）
     *            }
     *        }
     * @return {Boolean}
     *        返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *        返回false则表示运行环境处理JS接口调用失败。
     */
  printPage: function (argument, callback) {
    // 检查参数
    if (!argument) argument = {}
    if (!argument.printTask) argument.printTask = {}
    if (!argument.printTask.id) argument.printTask.id = ''
    // 当前页面url
    argument.printTask.url = location.href
    // input、select等元素值映射表<id, value>
    argument.printTask.values = {}
    // checkbox和radio元素checked值映射表<id, isChecked>
    argument.printTask.checked = {}

    // 获取要打印的页面元素（如果没有设置id，则打印目标为整个页面）
    let targetElement = null
    if (argument.printTask.id !== '') {
      targetElement = $('#' + argument.printTask.id)
      if (targetElement.length === 0) {
        console.error('没有找到待打印的页面元素(' + argument.printTask.id + ').')
        callback({
          resultCode: -1,
          resultMessage: '没有找到待打印的页面元素'
        })
        return true
      }
    }

    let idCounter = 0
    // 找出目标元素的子孙元素中所有<input>，记录对应的值。
    const inputElements = targetElement === null ? $('input') : targetElement.find('input')
    inputElements.each(function () {
      // 如果当前元素没有id的话，根据时间戳和计数值生成一个id给它。
      if (!$(this).attr('id')) {
        $(this).attr('id', (new Date()).valueOf() + '_' + idCounter++)
      }
      const inputType = $(this).attr('type').toLowerCase()
      if (inputType === 'checkbox' || inputType === 'radio') {
        argument.printTask.checked[$(this).attr('id')] = $(this).is(':checked')
      } else {
        argument.printTask.values[$(this).attr('id')] = $(this).val()
      }
    })
    // 找出目标元素的子孙元素中所有<select>，记录对应选项值。
    const selectElements = targetElement === null ? $('select') : targetElement.find('select')
    selectElements.each(function () {
      // 如果当前元素没有id的话，根据时间戳和计数值生成一个id给它。
      if (!$(this).attr('id')) {
        $(this).attr('id', (new Date()).valueOf() + '_' + idCounter++)
      }
      argument.printTask.values[$(this).attr('id')] = $(this).val()
    })

    return window.sstruntime.printPage(JSON.stringify(argument), (jsonStr) => { callback(JSON.parse(jsonStr)) })
  },

  /**
     * -- 打印网络PDF文档 --
     * @brief 系统打印机
     * @param argument {Object}
     *        {
     *            "printProperties": {},                // 参考printPage接口说明。
     *            "printTask": {                        // 打印任务
     *                "url": ""                            // 要下载和打印的pdf文档地址
     *            }
     *        }
     * @param callback {Function}
     *        回调函数对象。打印过程会多次回调，通知打印任务状态。参考调用示例。result数据结构如下：
     *        {
     *            "resultCode": 0,          // 打印成功则为0，其他为错误码或者提示码，提示码(130000~139999)如下：
     *                                         // 130001 - 警告提示，可能打印机缺纸、缺墨等
     *                                         // 130007 - 错误提示，打印机出错或者打印任务出错
     *                                         // 130009 - 通知提示，通知打印任务的执行状态。
     *            "resultMessage": ""       // 执行结果说明信息/提示信息
     *            "data": {
     *                "leftDocs": 0,        // 剩余打印文档数（预留字段）
     *                                         // 包含当前正在打印的文档。
     *                "leftPages": 0,       // 剩余打印页数（预留字段）
     *                                         // 包含当前正在打印的页面。当剩余打印页数为0时，则表示所有文档已经发送给打印机
     *                                         // 进行打印，但不一定出纸。当打印机缺纸或者缺墨时，打印数据只是发送给了打印机，
     *                                         // 系统无法跟踪打印机的实时打印状态（除非打印机驱动支持将打印机状态反馈给系统），
     *                                         // 因此有没有打印出纸，需要根据现场实际情况判定，这里通过应用无法进行检测。
     *                "currentDoc": "",     // 当前打印文档（预留字段）
     *                                         // 当前正在打印的文档名称，不包含后缀。客户端只负责传回提取到的文档名称，
     *                                         // 至于文档名称的可读性需要上层应用自行负责。
     *                "totalLeftPages": 0,  // 总的剩余打印页数（预留字段）
     *            }
     *        }
     * @return {Boolean}
     *        返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *        返回false则表示运行环境处理JS接口调用失败。
     */
  printWebPdf: function (argument, callback) {
    return runtimeCoreApi.service.async(
      'deviceService',
      'PrintWebPdfDocument',
      argument,
      2,
      callback
    )
  },

  /**
     * -- 打印网络PDF文档 --
     * @brief
     * @param argument {Object}
     *        {
     *            "printProperties": {},                // 参考printPage接口说明。
     *            "printTask": {                        // 打印任务
     *                "path": ""                           // 要打印的本地pdf文档绝对路径
     *            }
     *        }
     * @param callback {Function}                       // 参考printPage接口说明。
     * @return {Boolean}
     *        返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *        返回false则表示运行环境处理JS接口调用失败。
     */
  printLocalPdf: function (argument, callback) {
    return runtimeCoreApi.service.async(
      'deviceService',
      'PrintLocalPdfDocument',
      argument,
      2,
      callback
    )
  },

  /**
     * -- 打印PDF文档base64数据 --
     * @brief
     * @param argument {Object}
     *        {
     *            "printProperties": {},                // 参考printPage接口说明。
     *            "printTask": {                        // 打印任务
     *                "data": ""                           // 要打印的pdf文档base64数据
     *            }
     *        }
     * @param callback {Function}                       // 参考printPage接口说明。
     * @return {Boolean}
     *        返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *        返回false则表示运行环境处理JS接口调用失败。
     */
  printBase64Pdf: function (argument, callback) {
    return runtimeCoreApi.service.async(
      'deviceService',
      'PrintBase64PdfDocument',
      argument,
      2,
      callback
    )
  },

  /**
     * -- 多文档打印（预留接口） --
     * @brief
     * @param argument {Object}
     *        {
     *            "printProperties": {},                // 参考printPage接口说明。
     *            "printTasks": {                       // 打印任务
     *                "pdfs": [                            // 要打印的pdf文档数组，如果没有则为不传该字段，或者为空数组
     *                    {
     *                        "name": "name_of_pdf_doc_to_print_1",    // 要打印的PDF文档名称（不包含.pdf后缀）
     *                        "data": "base64_of_pdf_doc_to_print_1"   // 要打印的PDF文档base64数据
     *                    },
     *                    {
     *                        "name": "name_of_pdf_doc_to_print_1",
     *                        "data": "base64_of_pdf_doc_to_print_1"
     *                    }
     *                ],
     *                "urls": [                            // 要打印的文件url数组，如果没有则为不传该字段，或者为空数组
     *                    "url_of_file_to_print_1",
     *                    "url_of_file_to_print_2"
     *                ],
     *                "pages": [                           // 要打印的页面url数组，如果没有则为不传该字段，或者为空数组
     *                    "url_of_web_page_to_print_1",
     *                    "url_of_web_page_to_print_2"
     *                ],
     *                "paths": [                           // 要打印的文件路径(已经保存在本地)数组，如果没有则为不传该字段，或者为空数组
     *                    "path_of_file_to_print_on_local_disk_1",    // 要打印的本地文档路径
     *                    "path_of_file_to_print_on_local_disk_2"
     *                ]
     *            }
     *        }
     * @param callback {Function}
     * @return {Boolean}
     *        返回一个Boolean值，如果为true则表示JS接口调用成功，能够通过callback回调获取结果。
     *        返回false则表示运行环境处理JS接口调用失败。
     */
  print: function (argument, callback) {
    return false
  }

}
