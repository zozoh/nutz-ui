(function($) {
    var NM_JQ = 'floatdiv-jq';
    var NM_OPT = 'floatdiv-opt';
    var NM_DIV = 'floatdiv-div'; // 存放到宿主对象里的 DIV
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
                helper.jq.removeData(NM_DIV);
                $(this).undelegate().remove();
            });
        };

    // 扩展插件
    $.fn.extend({
        floatdiv: function(opt) {
            // 命令: 关闭
            if ('close' == opt) {
                close_all_floatdiv();
                return this;
            }
            // 命令: 从数组获取 helper
            if ('helper' == opt) {
                var div = this.data(NM_DIV);
                return getHelper(div);
            }
            // 命令: 重新定位
            if ('dock' == opt) {
                var div = this.data(NM_DIV);
                var helper = getHelper(div);
                var opt = helper.option;
                div.dockAt(this, opt.dockAt, opt.padding);
                return this;
            }
            close_all_floatdiv();
            // 开始初始化
            opt = $.extend(true, {
                on_show: function(div) {},
                on_close: function(div) {},
                events: {}
            }, opt);
            // 开始绘制
            var div = $('<div class="floatdiv"></div>').appendTo(document.body);
            div.addClass(opt.className || '').css({
                'position': 'fixed'
            });
            if (opt.width) {
                div.css('width', opt.width);
            }
            if (opt.height) {
                div.css('height', opt.height);
            }
            // 存储相关对象
            div.data(NM_JQ, this).data(NM_OPT, opt);
            this.data(NM_DIV, div);
            // 显示
            if (typeof opt.on_show == 'function') {
                opt.on_show.call(this, div);
            }

            // 调整位置
            div.dockAt(this, opt.dockAt, opt.padding);

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
                var m = /^(([a-z]+)(:))?(.*)$/.exec(key);
                var selector = $.trim(m[4]);
                var eventType = $.trim(m[2] ? m[2] : 'click');
                div.delegate(selector, eventType, function(e) {
                    var helper = getHelper(this);
                    var func = null;
                    // 查找对应的事件映射
                    for (var key in helper.option.events) {
                        var m = /^(([a-z]+)(:))?(.*)$/.exec(key);
                        var eventType = $.trim(m[2] ? m[2] : 'click');
                        var selector = $.trim(m[4]);
                        var jEle = helper.div.find(selector);
                        if (jEle.is(this)) {
                            func = helper.option.events[key];
                            break;
                        }
                    }
                    if (func) {
                        func.call(this, e, helper);
                    }
                });
            }

            // 返回自身以便链式赋值
            return this;
        }
    });
})(window.jQuery);