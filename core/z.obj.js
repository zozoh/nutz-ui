/**
 * 本文件将提供一组关于对象操作的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('obj', {
        //---------------------------------------------------------------------------------------
        // 从一个数组对象中选择一个元素
        // index == 0 表示第一个，
        // index == -1 表示最后一个
        // index == -2 表示倒数第二个
        // 如果 index 越界，返回 null
        get: function(array, index) {
            if(typeof index != 'number') return null;
            if(index < 0) index = array.size() + index;
            if(index < 0 || (index + 1) > array.size()) return null;
            return array[index];
        },
        // 深层获取对象的某个字段的值
        // obj 对象
        // fldpath 字段路径，比如 "x.y.z"
        // dft 如果没有值，默认返回啥
        val: function(obj, fldPath, dft) {
            if(!obj) return dft;
            var flds = fldPath.split('.');
            for(var i = 0; i < flds.length; i++) {
                obj = obj[flds[i]];
                if(!obj) return '';
            }
            return obj ? obj : dft;
        },
        //------------------------------------------------------------------
        // 将一个 JS 对象或者数组进行浅层克隆
        clone: function(obj) {
            // 无
            if(!obj) return obj;
            // 数组
            if($.isArray(obj)) {
                var re = [];
                for(var i = 0; i < obj.length; i++) {
                    re.push(obj[i]);
                }
                return re;
            }
            // 普通对象
            if($.isPlainObject(obj)) {
                var re = {};
                for(var key in obj) {
                    re[key] = z.clone(obj[key]);
                }
                return re;
            }
            // 其它
            return obj;
        },
        //------------------------------------------------------------------
        // 将一个 JS 对象变成可以阅读的字符串
        dump: function(obj, tab) {
            if(!tab) tab = '';
            var re = '';
            if(null == obj) {
                return 'null';
            }
            // 函数
            else if(typeof obj == 'function') {}
            // jQuery 对象
            else if(this.isJQuery(obj)) {}
            // DOM 对象
            else if(this.isDOM(obj)) {}
            // 数组
            else if($.isArray(obj)) {
                re += '[';
                if(obj.length > 0) {
                    re += tab + this.dump(obj[0], tab + '   ');
                    for(var i = 1; i < obj.length; i++) {
                        re += tab + ', ' + this.dump(obj[i], tab + ' ');
                    }
                }
                re += ']';
                return re;
            }
            // 字符串
            else if(typeof obj == 'string') {
                return '"' + obj.toString() + '"';
            }
            // 普通 JS 对象
            else if(typeof obj == 'object') {
                re += '{\n';
                for(var key in obj) {
                    var v = obj[key];
                    if(typeof v == 'function') {
                        re += tab + '"' + key + '" : function(){...}\n';
                        continue;
                    }
                    re += tab + key + ':';
                    if($.isArray(v)) re += this.dump(v, tab + ' ');
                    else re += this.dump(v, tab + ' ');
                    re += '\n';
                }
                return re + tab + '}';
            }
            return obj.toString();
        },
        // 判断一个对象是不是 DOM
        isDOM: function(obj) {
            return obj && typeof obj.nodeType == 'number' && typeof obj.nodeName == 'string' && typeof obj.parentNode == 'object';
        },
        // 判断一个对象是不是 jQuery 对象
        isJQuery: function(obj) {
            return obj && typeof obj.length == 'number' && obj.selector && typeof obj.context == 'object';
        }
    });
})(window.jQuery, window.NutzUtil);