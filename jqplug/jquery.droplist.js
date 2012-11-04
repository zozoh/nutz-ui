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
                txt: '_',
                val: '_'
            };

            opt.filter_txt = opt.filter_txt || '搜索...';

            opt.dock_at = opt.dock_at || 'MB';
            opt.dock_padding = opt.dock_padding || 2;

            opt.paging_mode = opt.paging_mode || DL_MODE_VERTICAL;

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
        fdiv_draw: function(sel) {
            var html = '';
            html += '<div class="droplist-dl-container">';
            html += '   <div class="droplist-dl-data"></div>';
            html += '</div>';
            sel.append(html);
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
            html += '       <div class="droplist-dl-pager-info droplist-dl-pager-item" cur="0" total="0">0 / 0</div>';
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
        fdiv_resize: function(fdiv) {
            var fsz = {
                w: fdiv.width(),
                h: fdiv.height()
            };
            var pjq = fdiv.find('.droplist-dl-pager');
            pjq.find('.droplist-dl-pager-item').css({
                'width': pjq.width() / 3
            });
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

                    dom.fdiv_draw(div);

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

                    // 绑定事件
                    fdiv.delegate('.droplist-dl-filter', 'click', events.filter_focus);
                    fdiv.delegate('.droplist-dl-filter-val', 'change', events.filter_change);

                    // 调整布局
                    layout.fdiv_resize(fdiv);
                },
                on_close: function(div) {
                    var fdiv = div.find('.droplist-dl-container');
                    // 取消绑定
                    fdiv.undelegate();
                    // 去掉class
                    sel.removeClass('droplist-dl-show');
                },
                events: {
                    '.droplist-dl-container': events.fdiv_click
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
        filter_focus: function(e){
            $(this).find('.droplist-dl-filter-val').focus();
        },
        filter_change: function(e){
            var cv = $(this).val();
            // 触发过滤事件
            // TODO
        }
    };

    var depose = function(sel) {

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