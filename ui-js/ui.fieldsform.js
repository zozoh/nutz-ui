/*
 * 提供一个列表编辑一个对象
 */
(function($, ui, $z) {
    function html_tr(opt, nm, val) {
        var txt = $z.ui.msg(opt.msg_prefix + nm, nm);
        var html = '<tr class="fieldsform-fld fieldsform-fld-' + nm + '" fld-name="' + nm + '"">';
        html += '    <td class="fieldsform-fld-nm">' + txt + '</td>';
        html += '    <td class="fieldsform-fld-val">' + val + '</td>';
        html += '</tr>';
        return html;
    }
    ui('fieldsform', {
        dft_option: {
            msg_prefix: 'fieldform.obj.'
        },
        methods: {
            add: function(nm, val) {
                var html = html(this.option, nm, val);
                $(html).appendTo(this.jq('.fieldsform-fields table'));
            }
        },
        on_init: function() {
            var html = '<div class="fieldsform">';
            if (this.option.title) {
                html += '<div class="fieldform-title">' + this.option.title + '</div>'
            }
            html += '    <ul class="fieldform-menu">'
            html += '        <li class="fieldform-menu-add">' + $z.ui.msg('fieldsform.add') + '</li>';
            html += '        <li class="fieldform-menu-clear">' + $z.ui.msg('fieldsform.clear') + '</li>';
            html += '    </ul>'
            html += '    <div class="fieldsform-fields"><table cellspacing="1" cellpadding="4" border="0">';
            if (this.option.obj) {
                for (var key in this.option.obj) {
                    var val = this.option.obj[key];
                    html += html_tr(this.option, key, val);
                }
            }
            html += '    </table></div>';
            html += '</div>';
            this.selection.html(html);
        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);