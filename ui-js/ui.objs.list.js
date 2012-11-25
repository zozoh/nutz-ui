(function($, ui, $z) {
    // .......................................... 帮助函数
    // .......................................... 开始定义控件
    ui('objs.list', {
        dft_option: {
            icon: true,
            actions: []
        },
        on_init: function() {
            var html = '<div class="objs objs-list">';
            for (var i = 0; i < this.option.data.length; i++) {
                var obj = this.option.data[i];
                // 获取当前对象的 actions
                var acs = [];
                for (var x = 0; x < this.option.actions.length; x++) {
                    var ac = this.option.actions[x];
                    if (!ac.types || ac.types.test(obj.type)) {
                        acs.push({
                            display: ac.display,
                            index: x
                        });
                    }
                }
                // 开始绘制
                var className = 'objs-item ' + (obj.className || '');
                if (acs.length > 0) {
                    className += ' objs-item-funcable';
                }
                html += '<div class="' + className + '" obj-id="' + obj.id + '">';
                if (this.option.icon) {
                    html += '<div class="objs-item-icon"></div>';
                }
                html += '    <div class="objs-item-text">' + obj.text + '</div>';
                if (obj.lm) {
                    html += '<div class="objs-item-lm">' + obj.lm + '</div>';
                }
                if (obj.ow) {
                    html += '<div class="objs-item-ow">' + obj.ow + '</div>';
                }
                if (acs.length > 0) {
                    html += '<div class="objs-funcs">';
                    for (var x = 0; x < acs.length; x++) {
                        var ac = acs[x];
                        var un = $z.ui.uname(ac.display);
                        html += '<div class="objs-funci" func-index="' + ac.index + '">';
                        html += un.text;
                        html += '</div>';
                    }
                    html += '</div>';
                }
                html += '</div>';
            }
            html += '</div>';
            this.selection.html(html);
        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);