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
        // TODO
        return opt;
    },
    selection: function(ele) {
        var me;
        if( ele instanceof jQuery) {
            me = ele;
        } else {
            me = $(ele);
        }
        if(me.hasClass(SEL_CLASS_NM))
            return me.parent();
        if(me.children(SEL_CLASS).size() > 0)
            return me;
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
        var html = '';
        html += '';
        selection.empty().append(html);
    },
    _initComponent: function(selection) {

    }
};
// _________________________________
var data = {
    init: function(selection) {

    }
};
// _________________________________
var events = {
    bind: function(selection) {
        // selection.delegate('', '', events.());
    },
    unbind: function(selection) {
        selection.undelegate();
    }
};
// _________________________________
var layout = {
    resize: function(selection) {
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
    droplist: function(opt, arg0, arg1, arg2, arg3, arg4) {
        var selection = this;
        // 检查有效选区
        if(selection.size() == 0)
            return selection;
        // 命令模式
        if(opt && ( typeof opt == "string")) {
            if("function" != typeof commands[opt])
                throw "$.fn.droplist: don't support command '" + opt + "'";
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
