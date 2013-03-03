/**
 * 本文件将提供一个函数，完成 XMLHttpRequest 方式的上传
 * 接受的参数对象:
 * {
 *    file : 文件对象,
 *    fileName : "xhr_FILE_NAME",  # 文件对象的名称在 header 中的名称，默认为 "xhr_FILE_NAME"
 *    url  : 接受上传的地址
 *    headers    : {...},          # 表示要增加的 header
 *    on_process : function(e){},  # 进度变化对象 e.loaded | e.total
 *    on_ok      : function(re){}, # 上传成功, this 为 xhr 对象
 *    on_error   : function(re){}  # 上传失败, this 为 xhr 对象
 * }
 * 服务器返回 AjaxReturn 对象
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('ajax.upload', function(opt) {
        // 处理默认配置信息
        opt = $.extend(true, {
            fileName: 'xhr_FILE_NAME',
            headers: {},
            on_process: function(e) {},
            on_ok: function() {},
            on_error: function() {}
        }, opt);
        var xhr = new XMLHttpRequest();
        // 检查
        if (!xhr.upload) {
            alert("XMLHttpRequest object don't support upload for your browser!!!");
            return;
        }
        // 进度回调
        xhr.upload.addEventListener("progress", opt.on_process, false);

        // 完成的处理
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var re = $z.json.fromJson(xhr.responseText);
                    if (re.ok) {
                        opt.on_ok.call(xhr, re);
                    } else {
                        opt.on_error.call(xhr, re);
                    }
                    return;
                }
                opt.on_error.call(xhr, {
                    ok: false
                });
            }
        };

        // 准备请求对象头部信息
        var contentType = "application/x-www-form-urlencoded; charset=utf-8";
        // var contentType = "multipart/form-data";
        xhr.open("POST", opt.url, true);
        xhr.setRequestHeader('Content-type', contentType)
        xhr.setRequestHeader(opt.fileName, "" + encodeURI(opt.file.name));
        // xhr.setRequestHeader('Content-Disposition', 'attachment; filename="' + encodeURI(opt.file.name) + '"');

        // 加入更多的头信息
        if (opt.headers) {
            for (var key in opt.headers) {
                xhr.setRequestHeader(key, "" + encodeURI(opt.headers[key]));
            }
        }

        // var formData = new FormData(); // 建立一个upload表单项，值为上传的文件
        // formData.append('upload_file', opt.file, opt.file.name);
        // xhr.send(formData)
        // 执行上传
        xhr.send(opt.file);
    });
})(window.jQuery, window.NutzUtil);