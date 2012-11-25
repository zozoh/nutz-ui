(function($, ui, $z) {
    // .......................................... 帮助函数
    var get_jqs = function(selection) {
            var jEx = selection.children('.explorer');
            var jFunc = jEx.children('.explorer-func');
            return {
                ex: jEx,
                bubble: jEx.children('.explorer-bubble'),
                func: jFunc,
                search: jFunc.children('.explorer-search'),
                modes: jFunc.children('.explorer-modes'),
                actions: jFunc.children('.explorer-actions'),
                objs: jEx.children('.explorer-objs')
            };
        };
    // .......................................... 开始定义控件
    ui('explorer', {
        dft_option: {
            className: '',
            selectable: 'multi',
            modes: [],
            data_id: function(obj) {
                var no = this.option.data_normalize.call(this, obj);
                return no.id;
            },
            data_type: function(obj) {
                var no = this.option.data_normalize.call(this, obj);
                return no.type;
            },
            data_normalize: function(obj) {
                return obj;
            },
            data_ui: function(obj) {
                throw 'No implement yet!';
            },
            data_current: function(id, callback) {
                throw 'No implement yet!';
            },
            data_search: function(keyword, callback) {
                throw 'No implement yet!';
            },
            do_rename: function(obj, newName, callback) {
                throw 'No implement yet!';
            },
            block_ui: function(obj) {
                throw 'No implement yet!';
            },
            actions: {},
            obj_click: function(obj, e, bind) {}
        },
        gasket: function(nm) {
            if ('bubble' == nm || 'actions' == nm || 'objs' == nm) {
                return get_jqs(this.selection)[nm];
            }
        },
        on_init: function() {
            var html = '<div class="explorer ' + (this.option.className || '') + '">';
            html += '<div class="explorer-bubble"></div>';
            html += '<div class="explorer-func">'
            if (this.option.data_search) {
                html += '<div class="explorer-search">';
                html += '    <input class="explorer-search-keyword">';
                html += '    <b class="explorer-search-btn btn">' + $z.ui.msg('explorer.search.do') + '</b>';
                html += '</div>';
            }
            html += '<div class="explorer-modes"><ul class="explorer-modes-ul cfloat">';
            for (var i = 0; i < this.option.modes.length; i++) {
                var md = this.option.modes[i];
                html += '<li class="diss explorer-modes-li explorer-mode-' + md + '" nm="' + md + '">' + md + '</li>';
            }
            html += '</ul></div>';
            html += '<div class="explorer-actions"></div>';
            html += '</div>'; // ~ end of .explorer-func
            html += '<div class="explorer-objs"></div>';
            html += '</div>';
            this.selection.html(html);
        },
        on_show: function() {
            // 建立数据缓存对象
            this._objs_ = {};

            // 绑定子控件: BubbuleBar
            ui('bubblebar').bind(this, 'bubble', {
                icon: this.option.icon,
                on_hlt: function(index, id, type, ele) {
                    this.parent().children.objs.hlt(index);
                }
            });
            ui('hierachy').bind(this, 'objs', {
                on_hlt: function(index, ele) {
                    // 初始化必要变量
                    var exBind = this.parent();
                    var iid = exBind.children.bubble.getId();
                    // 获取数据对象以及UI设定
                    var obj = exBind.getObj(iid);
                    var uiObj = exBind.option.block_ui.call(exBind, obj);
                    // 调用者，对这种数据对象，希望什么也不做哦 ...
                    if (!uiObj) {
                        return;
                    }
                    // 获取 UI 对应的数据
                    if (!$(ele).attr('nutz-ui-bind')) {
                        exBind.redrawCurrentBlock(obj, uiObj);
                    }
                    // 重新初始化操作菜单
                    exBind.redrawActionMenu(uiObj);
                }
            });

            // 对 body 加入事件，取消 action 菜单
            var jBody = $(document.body);
            if (!jBody.attr('explorer-actions-more-menu-event')) {
                jBody.attr('explorer-actions-more-menu-event', 'true').click(function() {
                    $('.explorer-actions-more-show').removeClass('explorer-actions-more-show');
                    $('.explorer-actions-more-menu').hide();
                });
            }
        },
        on_ready: function() {
            // 增加根节点
            this.setObj(this.option.root);
            // 增加根块
            this.pushBlock(this.option.root);
        },
        on_resize: function(sumW, sumH) {
            var jqs = get_jqs(this.selection);
            jqs.actions.css('width', sumW - jqs.search.outerWidth() - jqs.modes.outerWidth());
            jqs.objs.css('height', sumH - jqs.bubble.outerHeight() - jqs.func.outerHeight());
        },
        events: {
            '.explorer-actions-more': function(e) {
                e.stopPropagation();
                var jMoreMenu = $(this).parent().children('.explorer-actions-more-menu');
                // 隐藏
                if ($(this).hasClass('explorer-actions-more-show')) {
                    $(this).removeClass('explorer-actions-more-show');
                    jMoreMenu.hide();
                }
                // 显示
                else {
                    $(this).addClass('explorer-actions-more-show');
                    jMoreMenu.show().dockAt(this, 'LB', 1);
                }
            },
            '.explorer-actioni': function() {
                var acKey = $(this).attr('ac-key');
                var exBind = $z.ui.getBind(this);
                var obj = exBind.getObj();
                var func = exBind.option.actions[acKey].func;
                func.call(exBind, obj);
            },
            '.objs-item': function(e) {
                var jEx = $(this).parents('.explorer');
                var exBind = $z.ui.getBind(jEx);
                var iid = $(this).attr('obj-id');
                var obj = exBind.getObj(iid);
                if (typeof exBind.option.obj_click == 'function') {
                    exBind.option.obj_click.call(this, obj, e, exBind);
                }
            },
            '.objs-funcs': function(e) {
                e.stopPropagation();
            },
            '.objs-funci': function(e) {
                var jItem = $(this).parents('.objs-item');
                var jEx = jItem.parents('.explorer');
                var exBind = $z.ui.getBind(jEx);
                var iid = jItem.attr('obj-id');
                var obj = exBind.getObj(iid);
                var funcIndex = $(this).attr('func-index') * 1;
                exBind.option.obj_actions[funcIndex].func.call(this, obj, e, exBind);
            }
        },
        methods: {
            // 将对象显示到第一个非临时区块后面，并高亮它
            pushBlock: function(obj) {
                var no = this.option.data_normalize.call(this, obj);
                // 显示根节点
                this.children.objs.add();
                this.children.bubble.add(no);
                // 高亮最后一个区块
                this.children.bubble.hlt(-1);
                return this;
            },
            redrawActionMenu: function(uiObj) {
                var itemHtml = function(acKey, ac) {
                        var un = $z.ui.uname(ac.display);
                        var html = '<span class="explorer-actioni ' + (un.className || '') + '" ac-key="' + acKey + '">';
                        html += '<i></i><b>' + un.text + '</b>';
                        html += '</span>';
                        return html;
                    };
                var jqs = get_jqs(this.selection);
                jqs.actions.empty();
                var jContainer = $('<div class="explorer-actions-container diss"></div>').appendTo(jqs.actions);
                var jPins = $('<div class="explorer-actions-pin"></div>').appendTo(jContainer);
                var jMore = $('<div class="explorer-actions-more"></div>').appendTo(jContainer);
                var jMoreMenu = $('<div class="explorer-actions-more-menu"></div>').appendTo(jContainer);
                jMore.text($z.ui.msg('explorer.a.more'));
                for (var i = 0; i < uiObj.menu.length; i++) {
                    var m = uiObj.menu[i].match(/^([#~]?)(::)(.*)$/);
                    var acKey = m[3];
                    // 获得对应动作
                    var ac = this.option.actions[acKey];
                    if (!ac) {
                        continue;
                    }
                    // 获取显示
                    // 是否为 PIN
                    if ('#' == m[1]) {
                        $(itemHtml(acKey, ac)).appendTo(jPins);
                        continue;
                    }
                    // 是否需要绘制开始组
                    if ('~' == m[1] && jMoreMenu.children().size() > 0) {
                        $('<div class="explore-action-more-sepa"></div>').appendTo(jMoreMenu);
                    }
                    $(itemHtml(acKey, ac)).appendTo(jMoreMenu);
                }
                // 决定是否隐藏没必要的菜单项
                if (jPins.children().size() == 0) {
                    jPins.remove();
                }
                if (jMoreMenu.children().size() == 0) {
                    jMore.remove();
                    jMoreMenu.remove();
                }
                return this;
            },
            redrawCurrentBlock: function(obj, uiObj) {
                var exBind = this;
                var index = exBind.children.objs.getIndex();
                obj = obj || exBind.getObj();
                uiObj = uiObj || exBind.option.block_ui.call(exBind, obj);
                // 显示提示
                var html = '<div class="explorer-loading">' + $z.ui.msg('explorer.loading') + '</div>';
                exBind.children.objs.get().html(html);
                // 刷新数据
                exBind.option.data_ui.call(exBind, obj, function(objs) {
                    // 存储到自己本地
                    var normalizedObjs = [];
                    for (var i = 0; i < objs.length; i++) {
                        var iid = exBind.option.data_id.call(exBind, objs[i]);
                        exBind.setObj(objs[i]);
                        normalizedObjs.push(exBind.option.data_normalize.call(exBind, objs[i]));
                    }
                    // 绑定到 hierachy 的特定区块
                    ui(uiObj.ui).bind(exBind.children.objs, 'block_' + index, {
                        icon: exBind.option.icon,
                        data: normalizedObjs,
                        actions: exBind.option.obj_actions
                    });
                });
                return this;
            },
            getObj: function(id) {
                if (!id) {
                    return this._objs_[this.children.bubble.getId()];
                }
                return this._objs_[id];
            },
            setObj: function(obj) {
                this._objs_[this.option.data_id.call(this, obj)] = obj;
                return this;
            },
            delObj: function(id) {
                delete this._objs_[id];
                return this;
            }
        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);