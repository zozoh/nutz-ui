(function($, ui, $z) {
    // .......................................... 开始定义控件
    ui('bubblebar', {
        dft_option: {
            icon: true,
            on_hlt: function(index, id, ele) {
                // this 为 bind 对象
            }
        },
        methods: {
            hlt: function(index) {
                var jUl = this.jq('.bbar-ul');
                var ele = $z.obj.get(jUl.children().removeClass('bbar-li-hlt'), index);
                if (ele) {
                    var jq = $(ele).addClass('bbar-li-hlt');
                    // 移除临时
                    jq.nextAll().addClass('bbar-li-tmp');
                    // 增加临时
                    jq.prevAll().andSelf().removeClass('bbar-li-tmp');
                    // 调用回调
                    if (typeof this.option.on_hlt == 'function') {
                        this.option.on_hlt.call(this, index, jq.attr('bbar-iid'), jq.attr('bbar-type'), ele);
                    }
                }
            },
            // 获取当前高亮项目的下标，如果没有高亮，则返回 0
            getIndex: function() {
                return this.jq('.bbar-li-hlt').prevAll().size();
            },
            // 获取某个项目的 jq 对象，如果 index 未定义，则获取当前高亮的区块
            get: function(index) {
                var jUl = this.jq('.bbar-ul');
                if (typeof index == 'undefined') return jUl.children('.bbar-li-hlt').first();
                return $($z.obj.get(jUl.children(), index));
            },
            // 获取某个项目的 "bbar-iid" 属性
            getId: function(index) {
                var jLi = this.get(index);
                return jLi.attr('bbar-iid');
            },
            // 当前有多少项目
            //  ignoreTemp : 为 true 的时候，表示计算区块需要忽略临时区块
            size: function(ignoreTemp) {
                if (ignoreTemp) {
                    return this.jq('.bbar-li').not('.bbar-li-tmp').size();
                }
                return this.jq('.bbar-li').size();
            },
            // 清除所有临时项目
            clearTemp: function() {
                this.jq('.bbar-li-tmp').remove();
            },
            // 增加一个显示项
            // obj.id - 记录数据对象的 ID
            // obj.text - 显示文字
            // obj.type - 对象所属分类
            // obj.className - 显示对象的特殊类选择器名称
            // obj.icon - true|false|字符串  是否显示一个图标，如果是字符串，则为特殊类选择器，默认为 true
            // @return 增加的新项的下标
            add: function(obj) {
                this.clearTemp();
                var html = '<div class="bbar-li ' + (obj.className || '') + '">';
                if (this.option.icon) {
                    html += '<i class="bbar-icon ' + (typeof obj.icon == 'string' ? obj.icon : '') + '"></i>';
                }
                if (obj.text) {
                    html += '<b class="bbar-text">' + obj.text + '</b>';
                }
                html += '</div>';
                var jUl = this.jq('.bbar-ul');
                var index = jUl.children().size();
                $(html).appendTo(jUl).attr('bbar-iid', obj.id).attr('bbar-type', obj.type || 'unknown');
                return index;
            }
        },
        events: {
            '.bbar-li': function() {
                var myBind = $z.ui.getBind(this);
                var index = $(this).prevAll().size();
                myBind.hlt(index);
            }
        },
        on_init: function() {
            var html = '<div class="bbar cfloat ' + (this.option.className || '') + '">';
            html += '<div class="bbar-ul"></div>';
            html += '</div>';
            this.selection.html(html);
        },
        on_resize: function(sumW, sumH) {}
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);