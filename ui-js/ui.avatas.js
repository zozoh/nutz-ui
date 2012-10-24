/*
 * 提供 n 个上传控件，以便可以编辑 n 种精度的头像，其中 n 默认为 3
 *
 * 扩展点:
 *   - 无 -
 * 依赖:
 *  - jquery.reloadimg.js
 *  - z.js
 *  - z.ajax.upload.js
 */
(function($, ui, $z) {
    // .......................................... 开始定义控件
    ui("avatas", {
        on_init: function() {
            var imgsrc = $z.ui.url("/avata/" + this.option.cate + "/" + this.option.nm + "/");

            var html = '<div class="avatas">';
            html += '<div class="avatas-forms cfloat">'
            for (var i = 0; i < this.option.sizes.length; i++) {
                var sz = this.option.sizes[i];
                var m = /^([0-9]+)([xX])([0-9]+)$/.exec(sz);
                var w = m[1] * 1;
                var h = m[3] * 1;
                var trID = this.ID + sz;
                html += '<div avata-sz="' + sz + '" valign="top" class="avatas-form avatas-formi-' + sz + ' cfloat">';
                html += '    <div class="avatas-uploader diss">';
                html += '        <div class="avatas-uploader-file">';
                html += '            <input type="file" accept="image/jpeg,image/gif,image/png">';
                html += '        </div>';
                html += '        <label for="' + trID + '">';
                html += '            <input id="' + trID + '" type="checkbox" checked>' + $z.ui.msg('avata.modi');
                html += '        </label>';
                html += '        <span class="avatas-uploader-btn">' + $z.ui.msg('avata.upload') + '</span>';
                html += '        <span class="avatas-process"></span>';
                html += '    </div>';
                html += '    <div class="avatas-sz">' + sz + '</div>';
                html += '    <div class="avatas-pic"><img src="' + (imgsrc + sz) + '"';
                html += '        width="' + w + '" height="' + h + '"/></div>';
                html += '</div>';
            }
            html += '</div>';
            this.selection.html(html);
        },
        on_resize : function(w, h) {
            var jq = this.jq('.avatas-form');
            var maxH = 0;
            jq.each(function(){
                maxH = Math.max(maxH, $(this).height());
            });
            jq.each(function(){
                $(this).css('height', maxH);
            });
        },
        events: {
            ".avatas-uploader-btn": function() {
                // 首先获取文件对象
                var fInput = $(this).parents(".avatas-uploader").find(".avatas-uploader-file input")[0];
                if (fInput.files.length == 0) {
                    $z.ui.warn("avata.needfile");
                    return;
                }
                // 然后得到 form 并执行上传
                var jq = $(this).parents(".avatas-form");
                var szs = [jq.attr("avata-sz")];
                var jCheck = jq.find(":checkbox");
                if (jCheck.size() > 0 && jCheck[0].checked) {
                    jq.nextAll().each(function() {
                        szs.push($(this).attr("avata-sz"));
                    });
                }
                var bind = $z.ui.getBind(jq);
                var opt = bind.option;
                var url = $z.ui.url("/avata/upload");
                var jProcessing = jq.find(".avatas-process");
                jProcessing.removeClass("avatas-process-warn").removeClass("avatas-process-done");
                jProcessing.addClass("avatas-process-ing");
                $z.ajax.upload({
                    file: fInput.files[0],
                    url: $z.ui.url("/avata/upload"),
                    headers: {
                        'xhr_cate': opt.cate,
                        'xhr_nm': opt.nm,
                        'xhr_szs': szs
                    },
                    on_process: function(e) {
                        jProcessing.text("" + parseInt(e.loaded * 10000 / e.total) / 100 + "%");
                    },
                    on_ok: function() {
                        bind.jq(".avatas-pic img").reloadimg()
                        jProcessing.removeClass("avatas-process-ing").addClass("avatas-process-done");
                        jProcessing.text($z.ui.msg("avata.upload.done"));
                        $z.be.blinkIt(jProcessing, {
                            speed: 3000,
                            after: function() {
                                this.text("");
                            }
                        });
                    },
                    on_error: function() {
                        jProcessing.removeClass("avatas-process-ing").addClass("avatas-process-warn");
                        jProcessing.text('Fail to upload "' + file.name + '"\n\n' + xhr.responseText);
                        $z.be.blinkIt(jProcessing);
                    }
                });
            }
        },
        dft_option: {
            sizes: ["64x64"],
            // 请按照从大到小的顺序排列
            cate: "u",
            // 分类，需要绑定时配置
            nm: "zozoh" // 名称，需要绑定时配置
        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);