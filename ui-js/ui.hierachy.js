(function($, ui, $z) {
    // .......................................... 帮助函数
    // .......................................... 开始定义控件
    ui('hierachy', {
        dft_option: {
            // 滚动速度
            speed: 300,
            on_hlt: function(index, ele) {
                // this 为 bind 对象
            }
        },
        gasket: function(nm) {
            var m = nm.match(/^(block_)([0-9]+)$/);
            if (m) {
                return this.get(m[2] * 1);
            }
        },
        methods: {
            hlt: function(index) {
                var jScroller = this.jq('.hie-scroller');
                var ele = $z.obj.get(jScroller.children().removeClass('hie-block-hlt'), index);
                if (ele) {
                    var jq = $(ele).addClass('hie-block-hlt');
                    // 标记临时
                    jq.nextAll().addClass('hie-block-tmp');
                    // 增加临时
                    index = jq.prevAll().andSelf().removeClass('hie-block-tmp').size() - 1;
                    // 调用回调
                    if (typeof this.option.on_hlt == 'function') {
                        this.option.on_hlt.call(this, index, ele);
                    }
                    // 开始动画滚动
                    var w = this.selection.width();
                    jScroller.animate({
                        'left': w * index * -1
                    }, this.option.speed);
                }
            },
            // 获取当前高亮项目的下标，如果没有高亮，则返回 0
            getIndex: function() {
                var jScroller = this.jq('.hie-scroller');
                return jScroller.children('.hie-block-hlt').prevAll().size();
            },
            // 获取某个区块的 jq 对象，如果 index 未定义，则获取当前高亮的区块
            get: function(index) {
                var jScroller = this.jq('.hie-scroller');
                if (typeof index == 'undefined') return jScroller.children('.hie-block-hlt').first();
                return $($z.obj.get(jScroller.children(), index));
            },
            // 当前有多少项目
            //  ignoreTemp : 为 true 的时候，表示计算区块需要忽略临时区块
            size: function(ignoreTemp) {
                var jScroller = this.jq('.hie-scroller');
                if (ignoreTemp) {
                    return jScroller.children('.hie-block').not('.hie-block-tmp').size();
                }
                return jScroller.children('.hie-block').size();
            },
            // 清除所有临时项目
            clearTemp: function() {
                var tmpBlocks = this.jq('.hie-block-tmp');
                tmpBlocks.each(function() {
                    var theBind = $z.ui.getBind(this);
                    if ($z.ui.isBind(theBind)) {
                        theBind.depose();
                    }
                });
                tmpBlocks.remove();
            },
            // 增加一个新的区块
            // @return 增加的新项的下标
            add: function() {
                this.clearTemp();
                var html = '<div class="hie-block"></div>';
                var jScroller = this.jq('.hie-scroller');
                var index = jScroller.children().size();
                jScroller.css('width', this.selection.outerWidth() * (2 + index));

                var w = this.selection.width();
                var h = this.selection.height();

                $(html).appendTo(jScroller).css({
                    'width': w,
                    'height': h,
                    'float': 'left'
                });

                return index;
            }
        },
        on_init: function() {
            var html = '<div class="hie-viewport ' + (this.option.className || '') + '">';
            html += '<div class="hie-scroller"></div>'
            html += '</div>';
            this.selection.html(html);
            this.jq('.hie-viewport').css({
                'position': 'relative',
                'width': '100%',
                'height': '100%'
            });
        },
        on_show: function() {
            var jScroller = this.jq('.hie-scroller');
            jScroller.css({
                'position': 'absolute',
                'top': 0,
                'left': 0
            });
        },
        on_resize: function(sumW, sumH) {
            var jScroller = this.jq('.hie-scroller');
            var index = this.getIndex();
            jScroller.css({
                'left': sumW * index * (-1),
                'height': sumH
            }).children().css({
                'width': sumW,
                'height': sumH
            });

        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);