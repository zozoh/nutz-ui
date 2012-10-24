/**
 * 本文件将提供 Nutz-UI 最基本的框架性的支持，所有使用 Nutz-UI 的朋友，需要首先导入本文件
 *
 * 本文件依赖:
 *   > z.js
 *   > z.sys.js
 *   > z.url.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    var _version_ = '2.a.1';

    /*
     * 当 bind 对象被产生的时候，需要扩充的函数集合
     * 所有函数的 this 皆为 bind 对象本身
     */
    var BIND_METHODS = {
        // 获取本bind对应的 UI 类型对象
        ui: function() {
            return NutzUI.types[this.typeName];
        },
        // 根据一个路径来获取相对自己的 bind
        //  - 绝对路径 "/arena/g0_1"
        //  - 相对路径 "../g0_1"  
        //  - 相对自己的子 "./child_gasket/abc" 或 "child_gasket/abc"
        getBindByPath: function(path) {
            var nms = path.split(/\//);
            var bind;
            for (var i = 0; i < nms.length; i++) {
                switch (nms[i]) {
                case '':
                    bind = $z.ui.getBind();
                    break;
                case '.':
                    bind = bind || this;
                    break;
                case '..':
                    bind = (bind || this).parent();
                    break;
                default:
                    bind = (bind || this).children[nms[i]];
                }
                if (!bind) throw 'Invalid bind from "' + this.ID + '" > "' + path + '"';
            }
            return bind;
        },
        // 获取本 bind 内部的扩展点的 jq 对象
        gasket: function(name) {
            var g = this.ui().gasket.call(this, name);
            if (!g || g.size() == 0) {
                throw 'Unknow gasks[' + name + '] for "' + this.ID + '"';
            }
            return g;
        },
        // 获取本 bind 的父 bind，如果为根 bind，则返回 null
        parent: function() {
            var pjq = this.selection.parents('[' + NutzUI.BIND + ']').first();
            return pjq.size() > 0 ? NutzUI.binds[pjq.attr(NutzUI.BIND)] : null;
        },
        // 获取本 bind 对应的父 uiDef，如果没有，返回 null
        super: function() {
            var ui = this.ui();
            return ui.extend ? NutzUI.types[ui.extend] : null;
        },
        resize: function() {
            // 获取选区的尺寸
            var sz = this.selection[0] == document.body ? $z.sys.winsz() : {
                width: this.selection.width(),
                height: this.selection.height()
            };
            // 调用尺寸改变事件
            this.ui().on_resize.call(this, sz.width, sz.height);
            // 递归改变自己所有子 bind 的尺寸
            for (var key in this.children) {
                if (this.children[key].ID != this.ID) this.children[key].resize();
            }
            // 返回 bind 自身以便链式赋值
            return this;
        },
        // 依次触发 on_init -> on_show -> on_resize -> on_listen
        init: function(data) {
            // 记录数据
            this.data = data;

            // 获得 UI 定义对象
            var oUI = this.ui();

            // 首先，清除选区
            this.selection.undelegate();
            if (oUI.keepDom != true) {
                this.selection.empty();
            }

            // 开始初始化
            oUI.on_init.call(this);
            oUI.on_show.call(this);
            this.resize();

            // 声明式监听事件
            for (var key in oUI.events) {
                var func = oUI.events[key];
                if (typeof func == 'function') {
                    var m = /^(([a-z]+)(:))?(.*)$/.exec(key);
                    var eventType = $.trim(m[2] ? m[2] : 'click');
                    var selector = $.trim(m[4]);
                    this.selection.delegate(selector, eventType, func);
                }
            }

            // 自定义监听事件
            oUI.on_listen.call(this);

            // 初始化完毕，调用 ready
            oUI.on_ready.call(this);

            // 返回 bind 自身以便链式赋值
            return this;
        },
        depose: function() {
            // 注销全部的子绑定
            if (this.children) {
                for (var key in this.children) {
                    this.children[key].depose();
                }
            }
            // 注销自己
            this.selection.undelegate();
            var myUI = this.ui();
            if (!myUI.keepDom) {
                this.selection.empty();
            }
            myUI.on_depose.call(this);
            // 注销父 bind 的记录
            var p = this.parent();
            if (p) delete p.children[this.ID];
            // 注销全局记录
            delete NutzUI.binds[this.ID];

            // 返回 bind 自身以便链式赋值
            return this;
        },
        // 从本控件的选区，根据选择器查找一个对象
        jq: function(selector) {
            return this.selection.find(selector);
        }
    };

    /*
     * 当 UI 类型被定义的时候，加入类型对象的函数集
     * 所有函数的 this 皆为 uiDef 本身
     */
    var UI_DEF_METHODS = {
        // 创建一个绑定对象
        bind: function(bind, gasketName, option) {
            var selector;
            var selection;
            // 如果参数格式为 (selector, opt)
            if (typeof bind == 'string') {
                var m = REGEX_UI_SELECTOR.exec(bind);
                // 如果是 "@bind.ID:gasketName" 格式的字符串
                if (m) {
                    selector = bind;
                    opt = gasketName;
                    gasketName = m[4];
                }
                // 否则就是根控件的绑定方式
                else {
                    selector = bind;
                    opt = gasketName;
                    gasketName = null;
                }
            }
            // 如果为 (bind, gasketName, option)
            else if ($z.ui.isBind(bind) && typeof gasketName == 'string') {
                selector = '@' + bind.ID + ':' + gasketName;
            }
            // 如果是jq对象或dom对象
            else if ($(bind).size() > 0) {
                selector = bind;
                opt = gasketName;
                gasketName = null;
                selection = $(bind);
            }
            // 否则不可接受
            else {
                throw 'Wrong arguments when NutzUI.bind(' + bind + ',' + gasketName + ',' + option + ')';
            }

            // 得到选区对象
            selection = selection || $z.ui.jq(selector);
            if (selection.size() == 0) {
                throw "Empty selection for '" + selector + "'!";
            }
            // 得到绑定对象
            var theBind;
            var bindID = selection.attr(NutzUI.BIND);

            // 如果如果曾经绑定过，获取原先的绑定对象
            if (bindID) {
                theBind = window.NutzUI.binds[bindID];
                // 如果绑定的是别的 UI 类型，将原先的 bind 去除，以便重新绑定
                if (theBind.typeName != this.typeName) {
                    theBind.depose();
                    theBind = null;
                }
            }
            // 创建一个新的
            if (!theBind) {
                theBind = {
                    __nutz_ui_bind__: true,
                    ID: this.typeName + '_' + (this._insCount++),
                    typeName: this.typeName,
                    gasketName: gasketName,
                    gasketPath: '/',
                    ao: AO,
                    selector: selector,
                    selection: selection,
                    children: {}
                };
                selection.attr(NutzUI.BIND, theBind.ID);
                window.NutzUI.binds[theBind.ID] = theBind;
                // 扩展 bind 对象的方法
                $.extend(theBind, BIND_METHODS, NutzUI(this.typeName).methods);

                // 如果绑定到了 document.body 上，则监听 window.resize
                if (theBind.selection[0] == document.body) {
                    // 首先让 body 满屏
                    var sz = $z.sys.winsz();
                    theBind.selection.css('height', sz.height);
                    // 监听事件
                    window.onresize = function() {
                        var bindID = $(document.body).attr(NutzUI.BIND);
                        NutzUI('@' + bindID).resize();
                    };
                }
            }

            // 如果是一个子 bind，那么记录自己到父 bind 中，并重设自己的全路径
            if (gasketName) {
                var pBind = theBind.parent();
                if (pBind) {
                    pBind.children[gasketName] = theBind;
                    theBind.gasketPath = pBind.gasketPath + gasketName + '/';
                }
            }

            // 加入新的配置对象
            theBind.option = $.extend(true, {}, this.dft_option || {}, option || {});

            // 有初始化数据，先获取再执行初始化流程
            if (typeof theBind.option.data == 'function') {
                var reData = theBind.option.data.call(theBind, function(reData) {
                    theBind.init(reData);
                });
                if (reData) {
                    theBind.init(reData);
                }
            }
            // 没有初始化数据，直接开始自行初始化流程
            else {
                theBind.init();
            }

            // 返回
            return theBind;
        }
    };

    // 初始化 UI 框架
    window.NutzUI = function(uiTypeName, uiDef) {
        // 如果参数为动态的，展开它
        uiTypeName = typeof uiTypeName == 'function' ? uiTypeName() : uiTypeName;
        uiDef = typeof uiDef == 'function' ? uiDef() : uiDef;

        // 如果是定义一个 UI 对象
        if (typeof uiTypeName == 'string' && typeof uiDef == 'object') {
            // 看看是否是继承
            var puiDef = {};
            if (uiDef.extend) {
                puiDef = NutzUI(uiDef.extend);
            }
            // 开始定义 ...
            NutzUI.types[uiTypeName] = $.extend(true, {
                on_init: function() {},
                on_show: function() {},
                on_resize: function(w, h) {},
                on_depose: function() {},
                on_listen: function() {},
                on_ready: function() {},
                gasket: function(nm) {
                    return null;
                },
                events: {},
                methods: {}
            }, UI_DEF_METHODS, puiDef, uiDef, {
                typeName: uiTypeName,
                _insCount: 0
            });
            // 搞定，返回 ...
            return NutzUI.types[uiTypeName];
        }
        // 如果是一个绑定字符串
        if (/^(@)([a-zA-Z0-9._-]+)$/.test(uiTypeName)) {
            return NutzUI.binds[uiTypeName.substring(1)];
        }
        // 获取一个 uiDef 对象
        var uiType = NutzUI.types[uiTypeName];
        if (!uiType) {
            throw "Undefined NutzUI Type '" + uiTypeName + "'!";
        }
        return uiType;
    }; // 结束 UI 框架的初始化
    // 确保自己内部的数据结构
    NutzUI.BIND = 'nutz-ui-bind'; // 常量，将一个 bind 对象与 DOM 关联的 jQuery data 名
    NutzUI.OPTION = 'nutz-ui-bind-option'; // 常量，将一个 bind 对象的配置对象与 DOM 关联的 jQuery data 名
    NutzUI.version = this.version || _version_;
    NutzUI.binds = this.binds || {};
    NutzUI.types = this.types || {};

    /*
     * 扩展 $z.ui 的名称空间，增加一些帮助函数
     */
    var REGEX_UI_SELECTOR = /^(@)([a-zA-Z0-9._-]+)(:)([a-zA-Z0-9._-]+)$/;

    $z.def('ui', {
        /*----------------------------------------------------------------------
         * 从一个选择器中获取 jQuery 对象，选择器可以说标准 CSS 选择器，或者 "@bind.ID:名称"
         */
        jq: function(selector) {
            var m = REGEX_UI_SELECTOR.exec(selector);
            // Nutz UI 特殊选择器
            if (m) {
                var ID = m[2];
                var gasketName = m[4];
                var bind = window.NutzUI.binds[ID];
                return bind ? bind.gasket(gasketName) : null;
            }
            return $(selector);
        },
        /*----------------------------------------------------------------------
         * 从任何一个 DOM 或者 jq 对象中获取该对象所属的选区 jq 对象
         *  - selector 某个 DOM 对象，如果为 null 则默认为 document.body
         */
        selection: function(selector) {
            var jq = $(selector || document.body);
            if (jq.attr(NutzUI.BIND)) {
                return jq;
            }
            return jq.parents('[' + NutzUI.BIND + ']').first();
        },
        /*----------------------------------------------------------------------
         * 从任何一个 DOM 或者 jq 对象中获取该对象所属的绑定对象
         *  - selector 某个 DOM 对象，如果为 null 则默认为 document.body，则返回根 bind
         *    如果 selector 以 "/" 开头，则表示一个绑定路径，比如 "/arena/g0_1" 则返回对应的 bind
         */
        getBind: function(selector) {
            // 从路径获取
            if (typeof selector == 'string' && $z.str.startsWith(selector, '/')) {
                var nms = selector.substring(1).split(/[\/.]/);
                var bind = NutzUtil.ui.getBind();
                for (var i = 0; i < nms.length; i++) {
                    if (!bind) {
                        throw 'Invalid bind path "' + selector + '"!';
                    }
                    bind = bind.children[nms[i]];
                }
                return bind;
            }
            // DOM 获取
            var bindID = this.selection(selector).attr(NutzUI.BIND);
            return NutzUI('@' + bindID);
        },
        /*----------------------------------------------------------------------
         * 判断一个 JS 对象是不是 bind 对象
         */
        isBind: function(bind) {
            return bind && bind.__nutz_ui_bind__;
        },
        /*----------------------------------------------------------------------
         * 给出一个锚值对象分析的函数，锚值对象被假设为
         *   #[!]/chute:id=3478,kwd=XRR&/arena:showba=true
         *
         * @param ao 如果传入 ao，则表示要把该对象变成字符串
         * @return 根据传入的对象返回 ao 或者 字符串
         */
        ao: function(ao) {
            // 输出
            if (typeof ao == 'object') {
                var s = ao.force ? '!' : '';
                var list = [];
                if (ao.uis) for (var key in ao.uis) {
                    var params = [];
                    var item = ao.uis[key];
                    for (var nm in item)
                    params.push(nm + '=' + item[nm]);
                    list.push(key + ':' + params.join(','));
                }
                return s + list.join('&');
            }
            // 解析
            var pgan = ao || $z.url.pgan();
            var m = /^(!?)(.*)$/.exec(pgan);
            ao = {
                force: m && m[1] == '!',
                uis: {}
            };
            var s = $.trim(m[2]);
            if (s) {
                var ss = s.split('&');
                for (var i = 0; i < ss.length; i++) {
                    var str = $.trim(ss[i]);
                    if (!str) continue;
                    var pos = str.indexOf(':');
                    var key = str.substring(0, pos);
                    var sss = str.substring(pos + 1).split(',');
                    var params = {};
                    for (var x = 0; x < sss.length; x++) {
                        var n = sss[x].indexOf('=');
                        var paramName = $.trim(sss[x].substring(0, n));
                        params[paramName] = $.trim(sss[x].substring(n + 1));
                    }
                    ao.uis[key] = params;
                }
            }
            return ao;
        },
        /*----------------------------------------------------------------------
         * 解析一个字符串为一个按钮控件的显示信息
         * @param str 格式 [#~:][类选择器:][显示文字] 比如 "#:abc" 或 "#~::ui.show"
         * @return 一个 js 对象
         */
        uname: function(str) {
            var m = /^([#~]*)(:)([a-zA-Z0-9_-]*)(:)([a-zA-Z0-9_.-]+)$/.exec($.trim(str));
            if (!m) {
                throw "Uknown uname '" + str + "'!!!";
            }
            return {
                pin: m[1].indexOf('#') >= 0,
                // 是否是要固定显示的字符串
                beginGroup: m[1].indexOf('~') >= 0,
                // 是否重新开始一组
                className: m[3],
                // 选择器名称
                name: m[5],
                // 消息字符串键值
                text: this.msg(m[5]) // 变成多国语言后的文本
            };
        },
        /*----------------------------------------------------------------------
         * 从 UL#__msg__ 获 LI.key 的文本内容
         *
         * @param key -
         *            里面的 '.' 将被替换成 '_'
         * @return 如果没找到 LI 对象，则返回 defval ? key，否则返回 LI 的文本内容
         */
        msg: function(key, defval) {
            if (!key) {
                return '';
            }
            var li = $('#__msg__ .' + key.replace(/[.]/g, '_'));
            return li.size() > 0 ? $(li[0]).html() : (defval ? defval : key);
        },
        /*----------------------------------------------------------------------
         * 提供给 bind 对象，获取真实的 URL 的方法
         * 即，它会从 document.body 里获取 url 的前缀
         */
        url: function(url) {
            return ($(document.body).attr('nutz-url-prefix') || '') + url;
        },
        /*----------------------------------------------------------------------
         * 向用户询问某些信息
         * @param msg : 提示信息
         * @param callback : function(obj){...}     # 回调函数传入信息对象
         * @return 信息内容
         */
        ask: function(msg, callback) {
            var str = window.prompt(msg);
            if (str) {
                callback(str);
            }
        },
        /*----------------------------------------------------------------------
         * 界面显示给用户一个警告信息
         */
        warn: function(msg) {
            alert(this.msg(msg));
        },
        /*----------------------------------------------------------------------
         * 界面显示给用户一个信息窗口
         */
        info: function(msg) {
            alert(this.msg(msg));
        },
        /*----------------------------------------------------------------------
         * 从 document.body 读取当前 session 登录用户的名称
         */
        myName: function() {
            return $(document.body).attr('nutz-me-name');
        }
    });

    // 最后分析一下锚值对象
    var AO = $z.ui.ao();
    if (!AO.force) {
        AO = $.extend(true, window.NUTZ_PAGE_AO || {}, AO);
    }

})(window.jQuery, window.NutzUtil);