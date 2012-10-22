/**
 * 本文件将提供一个遮罩层的功能，它将显示一个遮罩层，遮住整个窗口
 *
 * 本文件依赖:
 *   > z.js
 *   > z.sys.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    var OPT_NM = 'masker.option';
    var BIND_ATTR_NM = 'ui-masker-resize-bind';
    // .........................................
    var getHelper = function() {
            var helper = {
                masker: $(document.body).children('.masker').last()
            };
            helper.option = helper.masker.data(OPT_NM);
            helper.bg = helper.masker.children('.masker-bg');
            helper.title = helper.masker.children('.masker-title');
            helper.closer = helper.masker.children('.masker-closer');
            helper.body = helper.masker.children('.masker-body');
            helper.btns = helper.masker.children('.masker-btns');
            return helper;
        };
    // ......................................... 计算真实的宽度
    // 从总尺寸，根据字符串 (*, 100%, 34) 等得出一个精确尺寸
    var _px = function(sum, str) {
            if ('*' == str) {
                return sum * 1;
            }
            if (typeof str == 'string' && $z.str.endsWith(str, '%')) {
                var n = str.substring(0, str.length - 1) * 1;
                return n * sum / 100;
            }
            return str * 1;
        };
    // ......................................... Esc 事件
    var on_key_esc = function(e) {
            if (27 == e.which) do_close(getHelper());
        };
    // ......................................... 修改尺寸事件
    var on_do_resize = function(e) {
            do_resize();
        };
    // ......................................... 修改尺寸
    var do_resize = function(helper) {
            var helper = helper || getHelper();
            var winsz = $z.sys.winsz();

            helper.bg.css({
                'width': winsz.width * 2,
                'height': winsz.height * 2
            });

            helper.title.css('width', winsz.width);
            helper.btns.css('width', winsz.width);

            var paddings = [];
            paddings[0] = helper.title.outerHeight();
            paddings[1] = parseInt((winsz.width - _px(winsz.width, helper.option.width)) / 2);
            var btnsH = helper.btns.outerHeight();
            var bodyMaxH = winsz.height - paddings[0] - btnsH;
            var bodyH = _px(bodyMaxH, helper.option.height);
            paddings[2] = bodyMaxH - bodyH + btnsH;
            paddings[3] = paddings[1];
            helper.body.css({
                'width': winsz.width,
                'height': winsz.height,
                'padding-top': paddings[0],
                'padding-right': paddings[1],
                'padding-bottom': paddings[2],
                'padding-left': paddings[3],
            });
            helper.option.on_resize.call(helper, helper.body.width(), helper.body.height());
        };
    // ......................................... 关闭
    var do_close = function(helper) {
            if (false != helper.option.on_close.call(helper)) {
                helper.masker.undelegate().remove();
                // 取消 '__masker_ele'
                if ($('.masker').size() == 0) {
                    $(document.body).children('.__masker_ele').removeClass("__masker_ele");
                    $(document.body).removeAttr(BIND_ATTR_NM);
                    $(window).unbind("resize", on_do_resize).unbind("keydown", on_key_esc);
                }
            }
        };
    //.......................................... 开始定义
    $z.def('ui.masker', function(opt) {
        // 命令
        if ('close' == opt) {
            do_close(getHelper());
            return;
        } else if ('helper' == opt) {
            return getHelper();
        }
        // 修正 option
        opt = $.extend(true, {
            closeable: true,
            width: "*",
            height: "*",
            background: {
                'background-color': "#000",
                'opacity': 0.6
            },
            on_show: function() {},
            on_close: function() {},
            on_resize: function() {},
            on_ready: function() {},
            btns: {},
            evetns: {}
        }, opt);
        // 初始化 DOM 对象
        var html = '<div class="masker ' + (opt.className || "") + '">';
        html += '<div class="masker-bg"></div>';
        html += '<div class="masker-title">' + (opt.title || "") + '</div>';
        html += '<div class="masker-body"></div>';
        if (opt.closeable) {
            html += '<div class="masker-closer">Close</div>';
        }
        html += '<ul class="masker-btns">';
        var btnNumber = 0;
        if (opt.btns) {
            for (var key in opt.btns) {
                btnNumber++;
                var uname = $z.ui.uname(key);
                html += '<li func="' + key + '" class="' + uname.className + '">';
                html += '<b>' + uname.text + '</b>';
                html += '</li>';
            }
        }
        html += '</ul>';
        html += '</div>';

        // 设置初始的 CSS，所有的子节点将都是绝对定位
        $(html).appendTo(document.body).children().css('position', 'fixed');
        var helper = getHelper();
        helper.masker.data(OPT_NM, opt);
        helper.option = opt;
        helper.bg.css($.extend(true, {
            'top': 0,
            'left': 0
        }, opt.background || {}));
        helper.title.css({
            'top': 0,
            'left': 0
        });
        helper.closer.css({
            'top': 0,
            'right': 0
        });
        helper.body.css({
            'top': 0,
            'left': 0
        });
        helper.btns.css({
            'bottom': 0,
            'left': 0
        });
        if (!opt.title) helper.title.hide();
        if (btnNumber == 0) helper.btns.hide();

        // 绑定事件
        helper.masker.delegate('.masker-closer', 'click', function() {
            $z.ui.masker('close');
        });
        helper.masker.delegate('.masker-btns li', 'click', function(e) {
            var helper = getHelper();
            var funcName = $(this).attr("func");
            var func = (helper.option.btns || {})[funcName];
            if (typeof func == 'function') {
                func.call(this, e, helper);
            }
        });
        // 绑定用户自定义事件
        for (var key in opt.events) {
            var func = opt.events[key];
            if (typeof func == 'function') {
                var m = /^(([a-z]+)(:))?(.*)$/.exec(key);
                var eventType = $.trim(m[2] ? m[2] : 'click');
                var selector = $.trim(m[4]);
                helper.masker.delegate(selector, eventType, func);
            }
        }

        // 调用显示事件
        opt.on_show.call(helper);

        // 调整尺寸
        do_resize(helper);
        if (!$(document.body).attr(BIND_ATTR_NM)) {
            $(document.body).attr(BIND_ATTR_NM, true);
            if (opt.closeable) {
                $(window).resize(on_do_resize).keydown(on_key_esc);
            }
            $(document.body).children().not('.masker').addClass("__masker_ele");
        }

        // 准备完毕
        opt.on_ready.call(helper);
    });
})(window.jQuery, window.NutzUtil);