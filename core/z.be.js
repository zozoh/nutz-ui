/**
 * 本文件将提供一组扩充 DOM 行为的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('be', {
        /*---------------------------------------------------------------------------------------
         * jq - 要移除的对象
         * opt.after - 当移除完成后的操作, this 为 jq 对象
         * opt.holder - 占位符的 HTML，默认是 DIV.z_remove_holder
         * opt.speed - 移除的速度，默认为  300
         * opt.appendTo - (优先)一个目标，如果声明，则不会 remove jq，而是 append 到这个地方
         * opt.prependTo - 一个目标，如果声明，则不会 remove jq，而是 preppend 到这个地方
         */
        removeIt: function(jq, opt) {
            // 格式化参数
            jq = $(jq);
            opt = opt || {};
            if (typeof opt == 'function') {
                opt = {
                    after: opt
                };
            } else if (typeof opt == 'number') {
                opt = {
                    speed: opt
                };
            }
            // 计算尺寸
            var w = jq.outerWidth();
            var h = jq.outerHeight();
            // 增加占位对象，以及移动 me
            var html = opt.holder || '<div class="z_remove_holder">&nbsp;</div>';
            var holder = $(html).css({
                'width': w,
                'height': h
            }).insertAfter(jq);
            // 删除元素
            if (opt.appendTo) {
                jq.appendTo(opt.appendTo);
            } else if (opt.prependTo) {
                jq.prependTo(opt.prependTo);
            } else {
                jq.remove();
            }
            // 显示动画
            holder.animate({
                width: 0,
                height: 0
            }, opt.speed || 300, function() {
                $(this).remove();
                if (typeof opt.after == 'function') {
                    opt.after.call(jq);
                }
            });
        },
        /*---------------------------------------------------------------------------------------
         * jq - 要闪烁的对象
         * opt.after - 当移除完成后的操作
         * opt.html - 占位符的 HTML，默认是 DIV.z_blink_light
         * opt.speed - 闪烁的速度，默认为  500
         */
        blinkIt: function(jq, opt) {
            // 格式化参数
            jq = $(jq);
            opt = opt || {};
            if (typeof opt == 'function') {
                opt = {
                    after: opt
                };
            } else if (typeof opt == 'number') {
                opt = {
                    speed: opt
                };
            }
            // 得到文档中的
            var off = jq.offset();
            // 样式
            var css = {
                'width': jq.outerWidth(),
                'height': jq.outerHeight(),
                'border-color': '#FF0',
                'background': '#FFA',
                'opacity': 0.8,
                'position': 'fixed',
                'top': off.top,
                'left': off.left,
                'z-index': 9999999
            };
            // 建立闪烁层
            var lg = $(opt.html || '<div class="z_blink_light">&nbsp;</div>');
            lg.css(css).appendTo(document.body);
            lg.animate({
                opacity: 0.1
            }, opt.speed || 500, function() {
                $(this).remove();
                if (typeof opt.after == 'function') {
                    opt.after.call(jq);
                }
            });
        },
        /*---------------------------------------------------------------------------------------
         * ele - 为任何可以有子元素的 DOM 或者 jq，本函数在该元素的位置绘制一个 input 框，让用户输入新值
         * opt - object | function
         * opt.multi - 是否是多行文本
         * opt.text - 初始文字，如果没有给定，采用 ele 的文本
         * opt.width - 指定宽度
         * opt.height - 指定高度
         * opt.after - function(newval, oldval){...} 修改之后，
         *   - this 为被 edit 的 DOM 元素 (jq 包裹)
         *   - 传入 newval 和 oldval
         *   - 如果不给定这个参数，则本函数会给一个默认的实现
         */
        editIt: function(ele, opt) {
            // 处理参数
            var me = $(ele);
            var opt = opt || {};
            if (typeof opt == 'function') {
                opt = {
                    after: opt
                };
            } else if (typeof opt == 'boolean') {
                opt = {
                    multi: true
                };
            }
            if (typeof opt.after != 'function') {
                opt.after = function(newval, oldval) {
                    if (newval != oldval) {
                        this.text(newval);
                    }
                };
            }
            // 定义处理函数
            var onKeydown = function(e) {
                    // Esc
                    if (27 == e.which) {
                        $(this).val($(this).attr('old-val')).blur();
                    }
                    // Ctrl + Enter
                    else if (e.which == 13 && window.keyboard.ctrl) {
                        $(this).blur();
                    }
                };
            var onKeyup = function() {
                    var minWidth = $(this).attr('min-width') * 1;
                    $(this).css('width', Math.max(minWidth, this.value.length * 16));
                };
            var func = function() {
                    var me = $(this);
                    var opt = me.data('z-editit-opt');
                    opt.after.call(me.parent(), me.val(), me.attr('old-val'));
                    me.unbind('keydown', onKeydown).unbind('keyup', onKeyup).remove();
                };
            // 准备显示输入框
            var val = opt.text || me.text();
            var html = opt.multi ? '<textarea></textarea>' : '<input>';
            // 计算宽高
            var off = me.offset();
            var css = {
                'width': opt.width || me.outerWidth(),
                'height': opt.height || me.outerHeight(),
                'position': 'fixed',
                'top' : off.top,
                'left': off.left,
                'font-family': 'Courier',
                'z-index': 999999
            };

            // 显示输入框
            var jq = $(html).prependTo(me).val(val).attr('old-val', val);
            jq.attr('min-width', css.width).addClass('z_editit').css(css);
            jq.data('z-editit-opt', opt);
            return jq.one('blur', func).one('change', func).keydown(onKeydown).keyup(onKeyup).focus();
        } // ~ End of editIt
    });
})(window.jQuery, window.NutzUtil);