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
    //................................................. 帮助函数: 清除所有浮动 DIV
    function close_all_floatdiv() {
        $('.floatdiv').each(function() {
            var jq = $(this).data('jq');
            var on_close = $(this).data('on_close');
            if (typeof on_close == 'function') {
                on_close.call(jq, $(this));
            }
            $(this).remove();
        });
    }
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
    // 扩展插件
    $.fn.extend({
        floatdiv: function(opt) {
            close_all_floatdiv();
            opt = opt || {};
            // 开始绘制
            var div = $('<div class="floatdiv"></div>').appendTo(document.body);
            div.addClass(opt.className || '').css({
                'position': 'fixed',
                'width': opt.width || 200
            });
            if (opt.height) {
                div.css('height', opt.height);
            }
            // 计算位置，网页的绝对位置
            var jqSz = {
                w: this.outerWidth(),
                h: this.outerHeight()
            };
            var divSz = {
                w: div.outerWidth(),
                h: div.outerHeight()
            };
            var off = _[opt.dockAt || 'RB'](this.offset(), jqSz, divSz, opt.padding || 0);
            div.css({
                'top': off.top,
                'left': off.left
            }).data('jq', this).data('on_close', opt.on_close);
            // 显示
            if (typeof opt.on_show == 'function') {
                opt.on_show.call(this, div);
            }
            // 隐藏事件
            if (!$(document.body).attr('floatdiv-event-bound')) {
                $(document.body).click(close_all_floatdiv);
                $(window).keydown(function(e) {
                    // 按下了 ESC 键
                    if (e.which == 27) close_all_floatdiv();
                });
                // 记录一下，以避免重复绑定
                $(document.body).attr('floatdiv-event-bound', true);
            }
            return this;
        }
    });
})(window.jQuery);