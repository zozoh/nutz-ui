/**
 * 控件介绍
 *
 * 根据选取绘制一个droplist
 *
 * 依赖floatdiv控件，用来显示浮动的下拉框位置
 *
 * {
 *
 * }
 */
(function($) {
    var OPT_NAME = "droplist_option";
    var SEL_CLASS = ".droplist";
    var SEL_CLASS_NM = "droplist";
    var MODE_LR = 'lr_switch';
    var MODE_UD = 'ud_switch';
    var MODE_SC = 'scroll';
    var MODES = {
        'scroll': true,
        'lr_switch': true,
        'ud_switch': true
    };
    // _________________________________
    var util = {
        opt: function(selection) {
            return $.data(selection[0], OPT_NAME);
        },
        setOpt: function(selection, opt) {
            $.data(selection[0], OPT_NAME, opt);
        },
        removeOpt: function(selection) {
            $.removeData(selection[0], OPT_NAME);
        },
        checkopt: function(opt) {
            // 没有值的时候，显示什么
            opt.noval = opt.noval || {
                txt: '_',
                val: '_'
            }
            // 文字显示位置
            opt.txtAlgin = opt.txtAlgin || 'left';
            opt.dockAt = opt.dockAt || 'MB';
            opt.data = opt.data || {
                snum: 5,
                slist: []
            };
            opt.data.snum = opt.data.snum > opt.data.slist.length ? opt.data.slist.length : opt.data.snum;
            opt.mode = opt.mode || 'scroll';
            return opt;
        },
        selection: function(ele) {
            var me;
            if (ele instanceof jQuery) {
                me = ele;
            } else {
                me = $(ele);
            }
            if (me.hasClass(SEL_CLASS_NM)) return me.parent();
            if (me.children(SEL_CLASS).size() > 0) return me;
            return me.parents(SEL_CLASS).parent();
        }
    };
    // _________________________________
    var dom = {
        init: function(selection) {
            // 生成html
            dom._initHtml(selection);
            // 控件初始化
            dom._initComponent(selection);
        },
        _initHtml: function(selection) {
            var noval = util.opt(selection).noval;
            var html = '';
            html += '<div class="droplist">';
            html += '   <div class="droplist-sel-val" val="' + noval.val + '">' + noval.txt + '</div>';
            html += '   <div class="droplist-sel-icon"><i class="jq-icon-16 arrow_down droplist-si"></i></div>';
            html += '</div>';
            selection.empty().append(html);
        },
        _initComponent: function(selection) {

        },
        // 滚动
        dl_html_scroll: function(sel, slist) {
            var html = '';
            html += '<ul class="droplist-list-ul">';
            for (var i = 0; i < slist.length; i++) {
                var s = slist[i];
                html += '<li class="droplist-list-li" val="' + s.val + '">';
                html += s.txt;
                html += '</li>';
            }
            html += '</ul>';
            sel.empty().append(html);
        },
        dl_ul_li: function(slist){
            var html = '';
            for (var i = 0; i < slist.length; i++) {
                var s = slist[i];
                html += '<li class="droplist-list-li" val="' + s.val + '">';
                html += s.txt;
                html += '</li>';
            }
            return html;
        },
        // 左右切换
        dl_html_lr_switch: function(sel, slist) {

        },
        // 上下切换
        dl_html_up_switch: function(sel, slist) {

        }
    };
    // _________________________________
    var events = {
        bind: function(selection) {
            // 点击droplist的时候，弹出下拉框
            selection.delegate('.droplist', 'click', events.showDroplist);

        },
        unbind: function(selection) {
            selection.undelegate();
        },
        selDroplist: function(e){
            var li = $(this);
            var sel = li.parents('.droplist-list-li').data('sel');
            var opt = util.opt(sel);
            sel.find('.droplist-sel-val').attr('val', li.attr('val')).html(li.html());
        },
        showDroplist: function(e) {
            // 防止出发到body
            e.stopPropagation();
            var dlbtn = $(this);
            var sel = util.selection(dlbtn);
            var opt = util.opt(sel);
            if (dlbtn.hasClass('show_list')) {
                return;
            }
            // 改变显示样式
            dlbtn.addClass('show_list');
            // 弹出下拉
            sel.floatdiv({
                className: 'droplist-list-container',
                dockAt: opt.dockAt,
                width: opt._dl_li_sz.w,
                height: opt._dl_li_sz.h * opt.data.snum + 4,
                events: {
                    
                },
                on_show: function(div) {
                    // 绑定事件

                    // 根据opt的配置项显示不同的下拉框
                    if (opt.mode == MODE_LR) {

                    } else if (opt.mode == MODE_UD) {

                    } else {
                        // 默认滚动
                        dom.dl_html_scroll(div, opt.data.slist);
                    }
                    layout.dl_ul_resize(div, opt);
                },
                on_close: function(div) {
                    // 取消绑定

                    // 改变样式
                    dlbtn.removeClass('show_list');
                }
            }).data('sel', sel);
        }
    };
    // _________________________________
    var layout = {
        resize: function(selection) {
            var opt = util.opt(selection);
            var dljq = selection;
            var dlval = dljq.find('.droplist-sel-val');
            var dlicon = dljq.find('.droplist-sel-icon');
            var dlsz = {
                w: dljq.width(),
                h: dljq.height()
            };
            // padding 4px 8px
            dlval.css({
                'width': dlsz.w - dlsz.h - 16,
                'height': dlsz.h - 8,
                'line-height': (dlsz.h - 8) + 'px',
                'text-align': opt.txtAlgin,
                'font-size': (dlsz.h - 18 > 12 ? dlsz.h - 18 : 12) + 'px',
                'top': '4px',
                'left': '8px'
            });
            dlicon.css({
                'width': dlsz.h - 8,
                'height': dlsz.h - 8,
                'top': '4px',
                'right': '8px'
            });
            dlicon.find('.droplist-si').css({
                'margin-top': (dlsz.h - 16 - 8) / 2 + 'px'
            });

            // 记录宽度，高度
            opt._dl_li_sz = {
                w: dlsz.w,
                h: dlsz.h
            };
        },
        dl_ul_resize: function(sel, opt) {
            var sz = opt._dl_li_sz;
            var li = sel.find('.droplist-list-li');
            li.css({
                'width': sz.w - 4,
                'height': sz.h,
                'line-height': sz.h + 'px',
                'text-align': opt.txtAlgin,
                'font-size': (sz.h - 18 > 12 ? sz.h - 18 : 12) + 'px',
            });
        }
    };
    // _________________________________
    var commands = {
        resize: function() {
            var selection = this;
            layout.resize(selection);
        },
        depose: function() {
            var selection = this;
            events.unbind(selection);
            util.removeOpt(selection);
            selection.empty();
        }
    };
    // _________________________________
    $.fn.extend({
        droplist: function(opt, xx) {
            var selection = this;
            // 检查有效选区
            if (selection.size() == 0) return selection;
            // 命令模式
            if (opt && (typeof opt == "string")) {
                if ("function" != typeof commands[opt]) throw "$.fn.droplist: don't support command '" + opt + "'";
                var re = commands[opt].call(selection, arg0, arg1, arg2, arg3, arg4);
                return typeof re == "undefined" ? selection : re;
            }
            // 先销毁再初始化
            commands.depose.call(selection);
            // 记录检查配置
            opt = util.checkopt(opt);
            util.setOpt(selection, opt);
            // dom初始化
            dom.init(selection);
            // 绑定事件
            events.bind(selection);
            // 调整布局
            layout.resize(selection);
            // 数据初始化
            data.init(selection);
            // 返回支持链式赋值
            return selection;
        }
    });
})(window.jQuery);