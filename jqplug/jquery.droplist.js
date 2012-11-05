/*
 * 绘制一个droplist，提供翻页，过滤功能
 */
(function($) {

    var DL_OPT = 'droplist-opt';

    var DL_MODE_SCROOL = 'S';
    var DL_MODE_HORIZONTAL = 'H';
    var DL_MODE_VERTICAL = 'V';

    var LI_DATA = 'droplist-li-data';

    var MSG_NODATA = 'no data';
    var MSG_LOADING = 'loading...'

    var util = {
        check_opt: function(sel, opt) {
            //
            opt = opt || {};

            // 无数据显示什么
            opt.nodata = opt.nodata || {
                txt: '无数据',
                val: '_'
            };

            opt.filter_txt = opt.filter_txt || '搜索...';

            opt.dock_at = opt.dock_at || 'MB';
            opt.dock_padding = opt.dock_padding || 2;

            opt.paging_mode = opt.paging_mode || DL_MODE_VERTICAL;

            opt.data_html = opt.data_html ||
            function(d) {
                return '<span class="droplist-dldc-li-default" val="' + d.val + '">' + d.txt + '</span>';
            };

            opt.data_ckb = opt.data_ckb ||
            function(d, li) {
                if (li.find('.droplist-dldc-li-default').attr('val') == d.val) {
                    li.addClass('hlt');
                    return true;
                }
                return false;
            };

            opt.show_num = opt.show_num || 5;

            opt.on_change = opt.on_change ||
            function(oi, ni) {
                var sel = $(this);
                var opt = util.opt(sel);
                sel.find('.droplist-sel-val').html(ni.txt).attr('val', ni.val);
            };

            if (opt.filter == 'default') {
                opt.filter = function(fstr, dl_item) {
                    if (new RegExp(fstr).test(dl_item.txt)) {
                        return true;
                    }
                    return false;
                };
            }

            // 就对象
            opt.oi = opt.nodata;

            opt._ft_ = '';

            // 绑定到sel上
            sel.data(DL_OPT, opt);

            return opt;
        },
        opt: function(sel) {
            return sel.data(DL_OPT);
        },
        sel: function(jq) {
            if (jq.hasClass('droplist-parent')) {
                return jq;
            }
            return jq.parents('.droplist-parent');
        }
    };

    var dom = {
        sel_draw: function(sel, opt) {
            var html = '';
            html += '<div class="droplist-sel">';
            html += '   <div class="droplist-sel-val" val="' + opt.nodata.val + '">' + opt.nodata.txt + '</div>';
            html += '   <div class="droplist-sel-icon"><i class="jq-icon-16 arrow-down"></i></div>';
            html += '</div>';
            sel.empty().append(html);
        },
        // --------------------------------------------------浮动dl
        fdiv_draw: function(sel, opt) {
            var html = '';
            html += '<div class="droplist-dl-container">';
            html += '   <div class="droplist-dl-data">';
            html += '       <div class="droplist-dl-data-msg">' + MSG_NODATA + '</div>';
            html += '       <div class="droplist-dl-data-co">';
            html += '       </div>';
            html += '   </div>';
            html += '</div>';
            sel.append(html);
        },
        filter_draw: function(sel, opt) {
            var html = '';
            html += '<div class="droplist-dl-top">';
            html += '   <div class="droplist-dl-filter">';
            html += '       <input class="droplist-dl-filter-val" value="' + opt._ft_ + '" placeholder="' + opt.filter_txt + '"/>';
            html += '   </div>';
            html += '</div>';
            sel.prepend(html);
        },
        bottom_bar_draw: function(sel, opt) {
            var html = '';
            html += '<div class="droplist-dl-bottom">';
            html += '   <div class="droplist-dl-pager">';
            html += '       <div class="droplist-dl-pager-prev droplist-dl-pager-item">';
            // 上一页
            if (opt.paging_mode == DL_MODE_HORIZONTAL) {
                html += '       <i class="jq-icon-16 white-arrow-left fcenter"></i>';
            } else if (opt.paging_mode == DL_MODE_VERTICAL) {
                html += '       <i class="jq-icon-16 white-arrow-up fcenter"></i>';
            }
            html += '       </div>';
            // 分页信息
            html += '       <div class="droplist-dl-pager-info droplist-dl-pager-item" cur="0" tol="0" mode="' + opt.paging_mode + '">0 / 0</div>';
            // 下一页
            html += '       <div class="droplist-dl-pager-next droplist-dl-pager-item">';
            // 上一页
            if (opt.paging_mode == DL_MODE_HORIZONTAL) {
                html += '       <i class="jq-icon-16 white-arrow-right fcenter"></i>';
            } else if (opt.paging_mode == DL_MODE_VERTICAL) {
                html += '       <i class="jq-icon-16 white-arrow-down fcenter"></i>';
            }
            html += '   </div>';
            html += '</div>';
            sel.append(html);
        },
        // ------------------------------------------- dl_list_item
        dl_list_html: function(fdiv, opt, dlist) {

            var fco = fdiv.find('.droplist-dl-data-co').empty();

            if (dlist.length == 0) {
                fdiv.find('.droplist-dl-data-msg').html(MSG_NODATA);
            } else {
                // 取消显示
                fdiv.find('.droplist-dl-data-msg').html('');
                // 显示数据
                if (opt.paging_mode == DL_MODE_SCROOL) {
                    fco.append('<ul class="droplist-dldc-ul-s"></ul>');
                    var ul = fdiv.find('.droplist-dldc-ul-s');
                    dom.dl_list_ul_html(ul, dlist, opt);
                } else {
                    if (opt.paging_mode == DL_MODE_HORIZONTAL) {
                        dom.dl_list_HV_ul_html(fdiv, fco, opt, dlist, 'droplist-dldc-ul-h');
                    } else if (opt.paging_mode == DL_MODE_VERTICAL) {
                        dom.dl_list_HV_ul_html(fdiv, fco, opt, dlist, 'droplist-dldc-ul-v');
                    }
                }
            }
        },
        dl_list_HV_ul_html: function(fdiv, fco, opt, dlist, ul_cls) {
            // 分页信息
            var tp = Math.floor(dlist.length / opt.show_num);
            if (dlist.length % opt.show_num != 0) {
                tp++;
            }
            fdiv.find('.droplist-dl-pager-info').html('1' + ' / ' + tp).attr('cur', 1).attr('tol', tp);

            // 绘制数据
            for (var i = 0; i < tp; i++) {
                var html = '';
                html += '<ul class="' + ul_cls + '">';
                html += '</ul>';
                fco.append(html);
                var ul = fco.children().last();
                var s = i * opt.show_num;
                var e = i * opt.show_num + opt.show_num;
                if (e >= dlist.length) {
                    e = dlist.length;
                }
                var udata = dlist.slice(s, e);
                dom.dl_list_ul_html(ul, udata, opt);
            }
        },
        dl_list_li_html: function(d, opt) {
            var html = '';
            html += '<li class="droplist-dldc-li">';
            html += '   <div class="droplist-dldc-li-item">';
            html += opt.data_html(d);
            html += '   </div>';
            html += '</li>';
            return html;
        },
        dl_list_ul_html: function(ul, udata, opt) {
            for (var j = 0; j < udata.length; j++) {
                var d = udata[j];
                var html = dom.dl_list_li_html(d, opt);
                ul.append(html);
                ul.children().last().children().data(LI_DATA, d);
            }
        },
        hlt_dl_ckb_list: function(fdiv, opt) {
            var lilist = fdiv.find('.droplist-dldc-li-item');
            for (var i = 0; i < lilist.length; i++) {
                var li = $(lilist[i]);
                if (opt.data_ckb(opt.oi, li)) {
                    break;
                }
            }
        }
    };

    var layout = {
        sel_resize: function(sel, opt) {
            var ssz = {
                w: sel.width(),
                h: sel.height()
            };

            sel.find('.droplist-sel-val').css({
                'width': ssz.w - 26
            });
        },
        fdiv_resize: function(fdiv, opt) {
            var fsz = {
                w: fdiv.width(),
                h: fdiv.height()
            };
            var pjq = fdiv.find('.droplist-dl-pager');
            pjq.find('.droplist-dl-pager-item').css({
                'width': pjq.width() / 3
            });

            fdiv.find('.droplist-dl-data-msg').css({
                'top': fsz.h / 2 - 45
            });

            var dldatajq = fdiv.find('.droplist-dl-data');

            // 是否显示 滚动条
            fdiv.find('.droplist-dl-data-co').css({
                'width': dldatajq.width(),
                'height': dldatajq.height(),
                'overflow-x': 'hidden',
                'overflow-y': opt.paging_mode == DL_MODE_SCROOL ? 'auto' : 'hidden'
            });
        },
        dl_co_resize: function(fdiv, opt) {
            var fd = fdiv.find('.droplist-dl-data');
            var fco = fdiv.find('.droplist-dl-data-co');
            var ful = fco.children();
            var fli = fdiv.find('.droplist-dldc-li');
            var co_h = fli.height() * opt.show_num;
            // 如果是自增长的话
            if (opt.paging_mode == DL_MODE_SCROOL && opt.show_num_auto) {
                co_h = fli.height() * fli.length;
            }
            fco.css({
                'height': co_h
            });
            fd.css({
                'height': co_h + 10
            });

            ful.css({
                'width': fco.width()
            });

            var fpg = fdiv.find('.droplist-dl-pager-info');

            if (opt.paging_mode == DL_MODE_HORIZONTAL) {
                fpg.attr('ml', fco.width() + 20);
                fco.css({
                    'width': (fco.width() + 20) * ful.length
                });
            } else if (opt.paging_mode == DL_MODE_VERTICAL) {
                fpg.attr('ml', fco.height() + 10);
                fco.css({
                    'height': (fco.height() + 10) * ful.length
                });
            }
        }
    };

    var data = {
        load: function(sel, dlist) {
            var opt = util.opt(sel);
            var fdiv = opt.fdiv;

            if (!fdiv) {
                // 已经没有fdiv了
                return;
            }

            if (!dlist) {
                // 初始化加载
                if ($.isArray(opt.data)) {
                    dlist = opt.data;
                } else if (typeof opt.data == 'function') {
                    // 加载数据
                    fdiv.find('.droplist-dl-data-msg').html('<i class="lding jq-loading-16"></i>');
                    // 同步方法也会返回数组
                    dlist = opt.data.call(sel);
                }
            }

            // 如果是数组，直接加载
            if ($.isArray(dlist)) {
                data._load(fdiv, opt, dlist)
            }
        },
        _load: function(fdiv, opt, dlist) {

            opt._dlist = dlist;

            var ndlist;

            if (typeof opt.filter == 'function') {
                ndlist = data.filter_data(opt.filter, opt._ft_, opt._dlist);
            } else {
                ndlist = dlist;
            }

            // 加载数据
            dom.dl_list_html(fdiv, opt, ndlist);
            // 调整高度
            layout.dl_co_resize(fdiv, opt);
            // 高亮
            dom.hlt_dl_ckb_list(fdiv, opt);
        },
        filter_data: function(filter, fstr, dlist) {
            var nplist = [];
            for (var i = 0; i < dlist.length; i++) {
                var d = dlist[i];
                // 通过过滤
                if (filter(fstr, d)) {
                    nplist.push(d);
                }
            }
            return nplist;
        },
        reload: function(sel, opt) {
            data.load(sel, opt._dlist);
        }
    };

    var events = {
        sel_click: function(e) {
            e.stopPropagation();

            var sel = util.sel($(this));

            if (sel.hasClass('droplist-dl-show')) {
                // 已经显示了，就不再显示了
                return;
            }

            var opt = util.opt(sel);

            // 设定宽度(左右padding)
            var fd_w = 20;

            if (opt.fd_width) {
                fd_w += opt.fd_width;
            } else {
                fd_w += sel.width();
            }

            sel.floatdiv({
                className: 'droplist-dl-fd',
                dockAt: opt.dock_at,
                width: fd_w,
                padding: opt.dock_padding,
                on_show: function(div) {

                    dom.fdiv_draw(div, opt);

                    var fdiv = div.find('.droplist-dl-container');

                    // 记录一下，回调会用到
                    opt.fdiv = fdiv;

                    // 是否添加filter
                    if (opt.filter && typeof opt.filter == 'function') {
                        dom.filter_draw(fdiv, opt);
                    }

                    // 是否添加底部按钮条
                    if (opt.paging_mode != DL_MODE_SCROOL) {
                        // 水平，垂直
                        dom.bottom_bar_draw(fdiv, opt);
                    }

                    // 调整布局
                    layout.fdiv_resize(fdiv, opt);

                    // 加载数据
                    data.load(sel);
                },
                on_close: function(div) {
                    var fdiv = div.find('.droplist-dl-container');
                    // 取消绑定
                    fdiv.undelegate();
                    // 去掉class
                    sel.removeClass('droplist-dl-show');

                    opt.fdiv = null;
                },
                events: {
                    'change:.droplist-dl-filter-val': events.filter_change,
                    '.droplist-dl-container': events.fdiv_click,
                    '.droplist-dl-filter': events.filter_focus,
                    '.droplist-dldc-li-item': events.dl_item_click,
                    // 分页显示
                    '.droplist-dl-pager-prev': events.dl_list_prev,
                    '.droplist-dl-pager-next': events.dl_list_next
                }
            });

            // 添加class
            sel.addClass('droplist-dl-show');
        },
        fdiv_click: function(e) {
            // 防止触发body的click，关闭了floatdiv
            e.stopPropagation();
            return;
        },
        filter_focus: function(e) {
            $(this).find('.droplist-dl-filter-val').focus();
        },
        filter_change: function(e, helper) {
            var cv = $(this).val();
            var opt = util.opt(helper.jq);
            // 触发过滤事件
            if (cv) {
                opt._ft_ = $.trim(cv);
            } else {
                opt._ft_ = '';
            }
            // 重现加载数据
            data.reload(helper.jq, opt);
        },
        dl_item_click: function(e, helper) {
            e.stopPropagation();
            var li = $(this);
            var ldata = $(this).data(LI_DATA);
            var opt = util.opt(helper.jq);
            opt.on_change.call(helper.jq, opt.oi, ldata);
            opt.oi = ldata;
            // 高亮自己
            helper.div.find('.droplist-dldc-li-item').removeClass('hlt');
            li.addClass('hlt');
            // 关掉fdiv
            helper.jq.floatdiv('close');
        },
        dl_list_prev: function(e, helper) {
            var pbtn = $(this);
            events.dl_list_move(pbtn, helper, false);
        },
        dl_list_next: function(e, helper) {
            var pbtn = $(this);
            events.dl_list_move(pbtn, helper, true);
        },
        dl_list_move: function(pbtn, helper, p) {
            var pg = pbtn.parent().find('.droplist-dl-pager-info');
            var mode = pg.attr('mode');
            var cur = parseInt(pg.attr('cur'));
            var tol = parseInt(pg.attr('tol'));
            var ml = parseInt(pg.attr('ml'));
            if (cur == 0 || cur == (p ? tol : 1)) {
                return;
            }
            cur += (p ? 1 : -1);
            pg.attr('cur', cur);
            pg.html(cur + ' / ' + tol);
            var cssp;
            if (mode == DL_MODE_HORIZONTAL) {
                cssp = {
                    'left': -1 * cur * ml + ml + 10
                };
            } else if (mode == DL_MODE_VERTICAL) {
                cssp = {
                    'top': -1 * cur * ml + ml + 5
                };
            }
            helper.div.find('.droplist-dl-data-co').animate(cssp, 200);
        }
    };


    var commands = {
        depose: function() {
            var sel = this;
            sel.undelegate();
            sel.empty();
        },
        load: function(dlist) {
            data.load(this, dlist);
        },
        set: function(nd) {
            var sel = this;
            var opt = util.opt(sel);
            opt.on_change.call(sel, opt.oi, nd);
            opt.oi = nd;
            return;
        },
        get: function() {
            var sel = this;
            return util.opt(sel).oi;
        }
    };


    $.fn.extend({
        droplist: function(opt, a1, a2, a3) {

            // 选区
            var sel = this;

            // 初始化模式
            if (typeof opt == 'object') {
                // 检查有效选区
                if (sel.size() == 0) {
                    throw '$.fn.droplist : unknown sel "' + sel.selector + '"';
                }
                // 检查opt文件的配置项是否完整
                opt = util.check_opt(sel, opt);

                sel.addClass('droplist-parent');

                // sel是否需要绘制
                if (opt.sel_draw) {
                    dom.sel_draw(sel, opt);
                    sel.delegate('.droplist-sel', 'click', events.sel_click);
                } else {
                    sel.delegate(opt.sel_click_cls, 'click', events.sel_click);
                }

                // 调整一下布局哟
                layout.sel_resize(sel);
            }
            // 命令模式
            else if (typeof opt == "string") {
                if ('function' != typeof commands[opt]) {
                    throw "$.fn.droplist : don't support command '" + opt + "'";
                }
                if (util.opt(sel)) {
                    var re = commands[opt].call(sel, a1, a2, a3);
                    if (re !== undefined) {
                        return re;
                    }
                }
            }

            return sel;
        }
    });
})(window.jQuery);