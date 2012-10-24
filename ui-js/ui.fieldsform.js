/*
 * 提供一个列表编辑一个对象
 */
(function($, ui, $z) {
    function html_tr(opt, nm, val) {
        var ws = opt.widths || ["36.2%", "61.8%"]
        var txt = $z.ui.msg(opt.msg_prefix + nm, nm);
        var html = '<tr class="fieldsform-fld fieldsform-fld-' + nm + '" fld-name="' + nm + '"">';
        html += '    <td width="' + ws[0] + '" class="fieldsform-fld-nm">' + txt + ':</td>';
        html += '    <td width="' + ws[1] + '" class="fieldsform-fld-val-wrapper">';
        html += '        <div class="fieldsform-fld-val">' + val + '</div>';
        html += '        <div class="fieldsform-fld-del">X</div>';
        html += '    </td>';
        html += '</tr>';
        return html;
    }
    ui('fieldsform', {
        dft_option: {
            on_save: function(obj, bind) {},
            msg_prefix: 'fieldform.obj.'
        },
        methods: {
            add: function(nm, val) {
                var html = html_tr(this.option, nm, val);
                $(html).appendTo(this.jq('.fieldsform-fields table'));
            },
            getData: function() {
                var obj = {};
                this.jq('.fieldsform-fld').each(function() {
                    var key = $(this).attr('fld-name');
                    if (key == 'new_nm') {
                        return;
                    }
                    var val = $(this).find('.fieldsform-fld-val').text();
                    obj[key] = val;
                });
                return obj;
            }
        },
        events: {
            '.fieldform-menu-add': function() {
                var myBind = $z.ui.getBind(this);
                myBind.add('new_nm', $z.ui.msg(myBind.option.msg_prefix + 'new_val', 'new_val'));
            },
            '.fieldform-menu-clear': function() {
                var myBind = $z.ui.getBind(this);
                myBind.jq('.fieldsform-fld').remove();
            },
            '.fieldform-menu-save': function() {
                var myBind = $z.ui.getBind(this);
                var obj = myBind.getData();
                myBind.option.on_save.call($(this), obj, myBind);
            },
            '.fieldsform-fld-del': function() {
                $(this).parents('.fieldsform-fld').remove();
            },
            '.fieldsform-fld-nm': function() {
                var myBind = $z.ui.getBind(this);
                var msg_prefix = myBind.option.msg_prefix;
                var jTr = $(this).parents('.fieldsform-fld');
                $z.be.editIt(this, {
                    text: jTr.attr('fld-name'),
                    after: function(newval, oldval) {
                        if (newval && newval != oldval) {
                            var txt = $z.ui.msg(msg_prefix + newval, newval) + ':';
                            jTr.attr('fld-name', newval);
                            this.text(txt);
                        }
                    }
                });
            },
            '.fieldsform-fld-val': function() {
                $z.be.editIt(this);
            }
        },
        on_init: function() {
            var html = '<div class="fieldsform">';
            if (this.option.title) {
                html += '<div class="fieldform-title">' + this.option.title + '</div>'
            }
            html += '    <ul class="fieldform-menu cfloat">'
            html += '        <li class="fieldform-menu-add">' + $z.ui.msg('fieldsform.add') + '</li>';
            html += '        <li class="fieldform-menu-clear">' + $z.ui.msg('fieldsform.clear') + '</li>';
            html += '        <li class="fieldform-menu-save">' + $z.ui.msg('fieldsform.save') + '</li>';
            html += '    </ul>'
            html += '    <div class="fieldsform-fields"><table width="100%" cellspacing="1" border="0">';
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