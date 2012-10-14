/**
 * 本文件将提供一个 toJson 的函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('json', function() {
        var type = typeof obj;
        // 空对象
        if (null == obj && ('object' == type || 'undefined' == type || 'unknown' == type)) return 'null';
        // 字符串
        if ('string' == type) return '"' + obj.replace(/(\\|\")/g, '\\$1').replace(/\n|\r|\t/g, function() {
            var a = arguments[0];
            return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : '';
        }) + '"';
        // 布尔
        if ('boolean' == type) return obj ? 'true' : 'false';
        // 数字
        if ('number' == type) return obj;
        // 是否需要格式化
        var format = false;
        if (typeof depth == 'number') {
            depth++;
            format = true;
        } else if (depth == true) {
            depth = 1;
            format = true;
        } else {
            depth = false;
        }
        // 数组
        if ($.isArray(obj)) {
            var results = [];
            for (var i = 0; i < obj.length; i++) {
                var value = obj[i];
                results.push($z.json(obj[i], depth));
            }
            return '[' + results.join(', ') + ']';
        }
        // 函数
        if ('function' == type) return '"function(){...}"';
        // 普通 JS 对象
        var results = [];
        // 需要格式化
        if (format) {
            // 判断一下，如果key少于3个，就不格式化了，并且，之内的所有元素都为 boolean, string,number
            var i = 0;
            for (var key in obj) {
                if (++i > 2) {
                    format = true;
                    break;
                }
                var type = typeof obj[key];
                if (type == 'object') {
                    format = true;
                    break;
                }
            }
            // 确定要格式化
            if (format) {
                var prefix = '\n' + this.dup(INDENT_BY, depth);
                for (key in obj) {
                    var value = obj[key];
                    if (value !== undefined) results.push(prefix + '"' + key + '" : ' + $z.json(value, depth));
                }
                return '{' + results.join(',') + '\n' + this.dup(INDENT_BY, depth - 1) + '}';
            }
        } // 紧凑格式
        for (var key in obj) {
            var value = obj[key];
            if (value !== undefined) results.push('"' + key + '":' + $z.json(value, depth));
        }
        return '{' + results.join(',') + '}';
    });
})(window.jQuery, window.NutzUtil);