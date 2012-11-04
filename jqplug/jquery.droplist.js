/*
 * 绘制一个droplist，提供翻页，过滤功能
 */
(function($) {

    var DL_OPT = 'droplist_opt';

    var DL_COUNT = 0;


    var DL_MODE_SCROOL = 'S';
    var DL_MODE_HORIZONTAL = 'H';
    var DL_MODE_VERTICAL = 'V';


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

            opt.show_num = opt.show_num || 5;

            // 绑定到sel上
            sel.data(DL_OPT, opt);

            return opt;
        },
        opt: function(sel) {
            return sel.data(DL_OPT);
        },
        next_dl: function() {
            DL_COUNT++;
            return 'droplist-dl-fd-' + DL_COUNT;
        },
        sel: function(jq) {
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
            html += '       <div class="droplist-dl-data-msg">' + opt.nodata.txt + '</div>';
            html += '       <div class="droplist-dl-data-co">';
            html += '       </div>';
            html += '   </div>';
            html += '</div>';
            sel.append(html);

            var fco = sel.find('.droplist-dl-data-co');
            if (opt.paging_mode == DL_MODE_SCROOL) {
                fco.append('<ul class="droplist-dldc-ul-s"></ul>');
            }
        },
        filter_draw: function(sel, opt) {
            var html = '';
            html += '<div class="droplist-dl-top">';
            html += '   <div class="droplist-dl-filter">';
            html += '       <input class="droplist-dl-filter-val" placeholder="' + opt.filter_txt + '"/>';
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
        dl_list_html: function(fdiv, dlist, opt) {
            // 取消显示
            fdiv.find('.droplist-dl-data-msg').html('');

            // 显示数据
            if (opt.paging_mode == DL_MODE_SCROOL) {
                var ul = fdiv.find('.droplist-dldc-ul-s');
                var html = '';
                for (var i = 0; i < dlist.length; i++) {
                    var d = dlist[i];
                    html += dom.dl_list_li_html(d, opt);
                }
                ul.append(html);
            } else {
                var tp = Math.floor(dlist.length / opt.show_num);
                if (dlist.length % opt.show_num != 0) {
                    tp++;
                }
                fdiv.find('.droplist-dl-pager-info').html('1' + ' / ' + tp).attr('cur', 1).attr('tol', tp);

                var html;
                if (opt.paging_mode == DL_MODE_HORIZONTAL) {
                    html = dom.dl_list_HV_ul_html(tp, opt, dlist, 'droplist-dldc-ul-h');
                } else if (opt.paging_mode == DL_MODE_VERTICAL) {
                    html = dom.dl_list_HV_ul_html(tp, opt, dlist, 'droplist-dldc-ul-v');
                }

                fdiv.find('.droplist-dl-data-co').append(html);
            }
        },
        dl_list_HV_ul_html: function(tp, opt, dlist, ul_cls) {
            var html = '';
            for (var i = 0; i < tp; i++) {
                html += '<ul class="' + ul_cls + '">';
                var s = i * opt.show_num;
                var e = i * opt.show_num + opt.show_num;
                if (e >= dlist.length) {
                    e = dlist.length;
                }
                var udata = dlist.slice(s, e);
                for (var j = 0; j < udata.length; j++) {
                    var d = udata[j];
                    html += dom.dl_list_li_html(d, opt);
                }
                html += '</ul>';
            }
            return html;
        },
        dl_list_li_html: function(d, opt) {
            var html = '';
            html += '<li class="droplist-dldc-li">';
            html += '   <div class="droplist-dldc-li-item">';
            html += opt.data_html(d);
            html += '   </div>';
            html += '</li>';
            return html;
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
                fpg.attr('ml', fco.height());
                fco.css({
                    'height': fco.height()* ful.length
                });
            }
        }
    };

    var data = {
        load: function(fdiv, opt) {
            var dlist;

            if ($.isArray(opt.data)) {
                dlist = opt.data;
            } else if (typeof opt.data == 'function') {
                // 同步方法也会返回数组
                dlist = opt.data();
            }

            // 如果是数组，直接加载
            if ($.isArray(dlist)) {
                dom.dl_list_html(fdiv, dlist, opt);
                // 调整高度
                layout.dl_co_resize(fdiv, opt);
            }
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
            // 绘制浮动框
            var fsz = {
                w: sel.width(),
                h: 0
            };

            sel.floatdiv({
                className: 'droplist-dl-fd',
                dockAt: opt.dock_at,
                width: fsz.w,
                padding: opt.dock_padding,
                on_show: function(div) {

                    dom.fdiv_draw(div, opt);

                    var fdiv = div.find('.droplist-dl-container');

                    // 是否添加filter
                    if (opt.filter && typeof opt.filter == 'function') {
                        dom.filter_draw(fdiv, opt);
                    }

                    // 显示内容
                    // 是否添加底部按钮条
                    if (opt.paging_mode != DL_MODE_SCROOL) {
                        // 水平，垂直
                        dom.bottom_bar_draw(fdiv, opt);
                    }

                    // 调整布局
                    layout.fdiv_resize(fdiv, opt);

                    // 加载数据
                    data.load(fdiv, opt);

                },
                on_close: function(div) {
                    var fdiv = div.find('.droplist-dl-container');
                    // 取消绑定
                    fdiv.undelegate();
                    // 去掉class
                    sel.removeClass('droplist-dl-show');
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
            alert(cv);
            // 触发过滤事件
            // TODO
        },
        dl_item_click: function(e, helper) {
            // TODO
        },
        dl_list_prev: function(e, helper) {
            var pg = $(this).parent().find('.droplist-dl-pager-info');
            var mode = pg.attr('mode');
            var cur = parseInt(pg.attr('cur'));
            var tol = parseInt(pg.attr('tol'));
            var ml = parseInt(pg.attr('ml'));
            if (cur == 1) {
                return;
            }
            cur--;
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
        },
        dl_list_next: function(e, helper) {
            var pg = $(this).parent().find('.droplist-dl-pager-info');
            var mode = pg.attr('mode');
            var cur = parseInt(pg.attr('cur'));
            var tol = parseInt(pg.attr('tol'));
            var ml = parseInt(pg.attr('ml'));
            if (cur == tol) {
                return;
            }
            cur++;
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


    $.fn.extend({
        droplist: function(opt, dval) {
            // 选区
            var sel = this;

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

            return sel;
        }
    });
})(window.jQuery);