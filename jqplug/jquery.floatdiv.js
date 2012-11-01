/*
 * 根据宿主对象，浮动一个 div 出来，显示在相对宿主对象的某个位置
 * <pre>
 * 'LT'     'MT'      'RT'
 * 'L'  $(selector)   'R'
 * 'LB'     'MB'      'RB'
 * </pre>
 * 本插件接受配置对象格式为:
 * {
 *      className : 'xxxx',      # 产生出来的 DIV 的 className
 *      dockAt    : 'lt|rt|...', # 参见位置图
 *      width     : 200,         # DIV 的宽度， 默认为 200
 *      height    : 0,           # DIV 的高度，默认为自动获取
 *      padding   : 10,          # 显示 DIV 的边距，默认为 0
 *      on_show   : function(div){...},        # 显示后: this 为宿主对象的 jq，div 为生成的 div 对象的 jq
 *      on_close  : function(div){...}         # 关闭前: this 为宿主对象的 jq，div 为生成的 div 对象的 jq
 * }
 */
(function($) {
    var NM_JQ = 'floatdiv-jq';
    var NM_OPT = 'floatdiv-opt';
    var NM_FUNC = 'floatdiv-func';
    // 根据 div 中的一个 DOM 元素（包括 floatdiv 本身），获取一个帮助对象
    var getHelper = function(ele) {
            var me = $(ele);
            if (!me.hasClass('floatdiv')) {
                me = me.parents('.floatdiv');
            }
            if (me.size() == 0) {
                throw 'Unknown ele in floatdiv : ' + ele;
            }
            return {
                div: me,
                jq: me.data(NM_JQ),
                option: me.data(NM_OPT)
            };
        };

    // 清除所有浮动 DIV
    var close_all_floatdiv = function() {
            $('.floatdiv').each(function() {
                var helper = getHelper(this);
                if (typeof helper.option.on_close == 'function') {
                    helper.option.on_close.call(helper.jq, helper.div, helper);
                }
                $(this).undelegate().remove();
            });
        };

    // 计算位置，每个函数都接受 off(宿主相对网页的绝对位置)
    // jqSz    : 宿主的尺寸
    // divSz   : 生成的 DIV 的尺寸
    // padding : 要留出的空白
    var _ = {
        LT: function(off, jqSz, divSz, padding) {
            return {
                top: off.top - divSz.h - padding,
                left: off.left + jqSz.w - divSz.w
            };
        },
        MT: function(off, jqSz, divSz, padding) {
            return {
                top: off.top - divSz.h - padding,
                left: off.left + parseInt(jqSz.w / 2) - parseInt(divSz.w / 2)
            };
        },
        RT: function(off, jqSz, divSz, padding) {
            return {
                top: off.top - divSz.h - padding,
                left: off.left
            };
        },
        L: function(off, jqSz, divSz, padding) {
            return {
                top: off.top + parseInt(jqSz.h / 2) - parseInt(divSz.h / 2),
                left: off.left - divSz.w - padding
            };
        },
        R: function(off, jqSz, divSz, padding) {
            return {
                top: off.top + parseInt(jqSz.h / 2) - parseInt(divSz.h / 2),
                left: off.left + jqSz.w + padding
            };
        },
        LB: function(off, jqSz, divSz, padding) {
            return {
                top: off.top + jqSz.h + padding,
                left: off.left + jqSz.w - divSz.w
            };
        },
        MB: function(off, jqSz, divSz, padding) {
            return {
                top: off.top + jqSz.h + padding,
                left: off.left + parseInt(jqSz.w / 2) - parseInt(divSz.w / 2)
            };
        },
        RB: function(off, jqSz, divSz, padding) {
            return {
                top: off.top + jqSz.h + padding,
                left: off.left
            };
        }
    };

    // 计算位置，网页的绝对位置
    var adjustPosition = function(sel, fdiv, pstr, padding) {
            // 计算位置，网页的绝对位置
            var jqSz = {
                w: sel.outerWidth(),
                h: sel.outerHeight()
            };
            var divSz = {
                w: fdiv.outerWidth(),
                h: fdiv.outerHeight()
            };
            var off = _[pstr || 'RB'](sel.offset(), jqSz, divSz, padding || 0);
            fdiv.css({
                'top': off.top,
                'left': off.left
            });
        };

    // 扩展插件
    $.fn.extend({
        floatdiv: function(opt) {
            close_all_floatdiv();
            opt = $.extend(true, {
                on_show: function(div) {},
                on_close: function(div) {},
                events: {}
            }, opt);
            // 开始绘制
            var div = $('<div class="floatdiv"></div>').appendTo(document.body);
            div.addClass(opt.className || '').css({
                'position': 'fixed',
                'width': opt.width || 200
            });
            if (opt.height) {
                div.css('height', opt.height);
            }

            // 存储相关对象
            div.data(NM_JQ, this).data(NM_OPT, opt);

            // 显示
            if (typeof opt.on_show == 'function') {
                opt.on_show.call(this, div);
            }

            // 调整位置
            adjustPosition(this, div, opt.dockAt, opt.padding);

            // 隐藏事件
            if (!$(document.body).attr('floatdiv-event-bound')) {
                $(document.body).click(close_all_floatdiv);
                $(window).keydown(function(e) {
                    // 按下了 ESC 键
                    if (e.which == 27) {
                        close_all_floatdiv();
                    }
                });
                // 记录一下，以避免重复绑定
                $(document.body).attr('floatdiv-event-bound', true);
            }

            // 绑定用户自定义事件
            for (var key in opt.events) {
                var func = opt.events[key];
                if (typeof func == 'function') {
                    var m = /^(([a-z]+)(:))?(.*)$/.exec(key);
                    var eventType = $.trim(m[2] ? m[2] : 'click');
                    var selector = $.trim(m[4]);
                    div.find(selector).each(function() {
                        $(this).attr(NM_FUNC, key);
                    });
                    div.delegate(selector, eventType, function(e) {
                        var helper = getHelper(this);
                        var funcKey = $(this).attr(NM_FUNC);
                        var func = helper.option.events[funcKey];
                        func.call(this, e, helper);
                    });
                }
            }

            // 返回自身以便链式赋值
            return this;
        }
    });
})(window.jQuery);