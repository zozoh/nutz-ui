/**
 * 本文件将提供一个遮罩层，并在上面绘制一个多文件上传的界面
 * 配置对象:
 * {
 *     closeWhenAllDone: true,      # 是否上传完全部关闭
 *     title: '...',                # 标题
 *     url: '...',                  # 目标 URL
 *     headers: {...},              # 请求头自定义字段
 *     done: function(objs) {...}   # 完成后的回调，传入一个对象数组表示返回
 * }
 * 本文件依赖:
 *   > z.js
 *   > z.sys.js
 *   > z.ajax.upload.js
 *   > z.ui.masker
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    function appendFileToList(file, jList) {

    }
    $z.def('ui.masker_upload', function(opt) {
        // 计算宽高
        var sz = $z.sys.winsz();
        var maskerOpt = {
            title: opt.title,
            closeable: false,
            width: 500,
            height: '*'
        };

        // 事件   
        maskerOpt.events = {

        };

        // 显示方法
        maskerOpt.on_show = function() {
            var html = '<div class="masker-upload">';
            html += '<div class="masker-upload-picker">';
            html += '    <input type="file" class="masker-upload-file">';
            html += '    <b class="btn masker-upload-submit">' + $z.ui.msg('masker.upload.submit') + '</b>';
            html += '    <b class="btn masker-upload-submit">' + $z.ui.msg('masker.upload.cancel') + '</b>';
            html += '</div>';
            html += '<div class="masker-upload-tip">' + $z.ui.msg('masker.upload.tip') + '</div>';
            html += '<div class="masker-upload-main"><div class="masker-upload-list"></div></div>';
            html += '</div>';
            this.body.html(html);
        };

        // 计算宽高
        maskerOpt.on_resize = function(w, h) {
            var H = h - this.body.find('.masker-upload-picker').outerHeight();
            H -= this.body.find('.masker-upload-tip').outerHeight();
            this.body.find('.masker-upload-main').css('height', H);
        };

        // 显示 ...
        $z.ui.masker(maskerOpt);
    });
})(window.jQuery, window.NutzUtil);