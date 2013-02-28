/**
 * 本文件将提供一个遮罩层，并在上面绘制一个多文件上传的界面
 * 配置对象:
 * {
 *     closeWhenAllDone: true,      # 是否上传完全部关闭
 *     title: '...',                # 标题
 *     url: '...',                  # 目标 URL
 *     headers: {...},              # 请求头自定义字段
 *     done: function(objs) {...}   # 完成后的回调，传入一个对象数组表示返回
 *                                   ?? TODO zozoh: objs 还未实现
 * }
 * 本文件依赖:
 *   > z.js
 *   > z.sys.js
 *   > z.str.js
 *   > z.ajax.upload.js
 *   > z.ui.masker
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    function appendFileToList(file, jList) {
        var html = '<ul class="masker-upload-fi masker-upload-fi-new cfloat">';
        html += '<li class="masker-upload-fi-type">' + file.type + '</li>';
        html += '<li class="masker-upload-fi-size">' + $z.str.sizeText(file.size) + '</li>';
        html += '<li class="masker-upload-fi-name">' + file.name + '</li>';
        html += '<li class="masker-upload-fi-process">';
        html += '    <div class="masker-upload-bar"><div class="masker-upload-bar-inner">0%</div></div>';
        html += '</li>';
        html += '</ul>'
        $(html).appendTo(jList).last().data('upload-file', file)[0].scrollIntoView(false);
    }

    function do_upload(helper, jq) {
        // 滚动
        jq[0].scrollIntoView(false);
        $z.be.blinkIt(jq);
        // 显示当前行
        jq.prevAll().removeClass('masker-upload-fi-ing');
        jq.removeClass('masker-upload-fi-new').addClass('masker-upload-fi-ing');
        // 准备调用
        var toUpFile = jq.data('upload-file');
        $z.ajax.upload({
            file: toUpFile,
            url: helper.option.url,
            headers: $.extend(true, {
                // 给几个默认参数
                '_file_nm_': toUpFile.name,
                '_file_type_': toUpFile.type,
                '_file_size_': toUpFile.size
            }, helper.option.headers),
            on_ok: function(re) {
                jq.removeClass('masker-upload-fi-ing').addClass('masker-upload-fi-done');
                // 如果全部完成
                if (helper.body.find('.masker-upload-fi-done').size() == helper.body.find('.masker-upload-fi').size()) {
                    if (helper.option.closeWhenAllDone) {
                        $z.ui.masker('close');
                    }
                }
                // 如果还是有新的
                else if (helper.body.find('.masker-upload-fi-new').size() > 0) {
                    do_upload(helper, helper.body.find('.masker-upload-fi-new').first());
                }
            },
            on_process: function(e) {
                var inner = jq.find('.masker-upload-bar-inner');
                var p = parseInt(10000 * e.loaded / e.total) / 100;
                var w = inner.parent().width() * p / 100;
                inner.css('width', w).text(p + '%');
            },
            on_error: function(re) {
                jq.removeClass('masker-upload-fi-ing').addClass('masker-upload-fi-err');
                var inner = jq.find('.masker-upload-bar-inner');
                inner.css('width', 0).text('0%');
                $('<div class="masker-upload-fi-errtip"></div>').appendTo(jq).text(re.msg);
            }
        });
    }

    $z.def('ui.masker_upload', function(opt) {
        // 计算宽高
        var sz = $z.sys.winsz();
        var maskerOpt = {
            title: opt.title,
            closeable: true,
            width: 600,
            height: '*',
            url: opt.url,
            headers: opt.headers || {},
            done: opt.done ||
            function() {},
            closeWhenAllDone: opt.closeWhenAllDone || false,
            on_close: opt.on_close ||
            function() {}
        };

        // 按钮
        maskerOpt.btns = $.extend(true, {}, (opt.btns || {}));

        // 事件   
        maskerOpt.events = {
            '.masker-upload-submit': function() {
                var helper = $z.ui.masker('helper');
                var jq = helper.body.find('.masker-upload-fi-new').first();
                if (jq.size() == 0) {
                    $z.ui.warn($z.ui.msg('masker.upload.nofile'));
                    return;
                }
                do_upload(helper, jq);
            },
            '.masker-upload-cancel': function() {
                // 直接关闭吧, 应该是判断是否在上传中, 上传了了的话取消后面的
                $z.ui.masker('close');
            },
            '.masker-upload-clear': function() {
                var helper = $z.ui.masker('helper');
                helper.body.find('.masker-upload-list').empty();
            },
            'change:.masker-upload-file': function() {
                var jList = $z.ui.masker('helper').body.find('.masker-upload-list');
                for (var i = 0; i < this.files.length; i++) {
                    appendFileToList(this.files[i], jList);
                }
            },
            'dragover:.masker-upload-list': function() {
                $(this).addClass("masker-upload-list-dragover");
            },
            'dragleave:.masker-upload-list': function() {
                $(this).removeClass("masker-upload-list-dragover");
            },
            'drop:.masker-upload-list': function(e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).removeClass("masker-upload-list-dragover");
                var jList = $z.ui.masker('helper').body.find('.masker-upload-list');
                if (e.originalEvent.dataTransfer) {
                    var files = e.originalEvent.dataTransfer.files;
                    for (var i = 0; i < files.length; i++) {
                        appendFileToList(files[i], jList);
                    }
                }
            },
            'drop:*': function(e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        // 显示方法
        maskerOpt.on_show = function() {
            var html = '<div class="masker-upload">';
            html += '<div class="masker-upload-picker">';
            html += '    <input type="file" name="upload_file" class="masker-upload-file"  multiple="multiple">';
            html += '    <b class="btn masker-upload-submit">' + $z.ui.msg('masker.upload.submit') + '</b>';
            html += '    <b class="btn masker-upload-cancel">' + $z.ui.msg('masker.upload.cancel') + '</b>';
            html += '    <b class="btn masker-upload-clear">' + $z.ui.msg('masker.upload.clear') + '</b>';
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