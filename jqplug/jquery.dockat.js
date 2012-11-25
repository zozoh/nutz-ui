(function($) {
    // 计算位置，每个函数都接受 off(宿主相对网页的绝对位置)
    // jqSz    : 目标对象的尺寸
    // divSz   : 浮动动对象的 DIV 的尺寸
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
        dockAt: function(target, posi, padding) {
            var div = this.css('position', 'fixed');
            var ta = $(target);
            // 调整位置
            adjustPosition(ta, div, posi, padding);

            // 返回自身以便链式赋值
            return this;
        }
    });
})(window.jQuery);