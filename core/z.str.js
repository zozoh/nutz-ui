/**
 * 本文件将提供一组字符串帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('str', {
        dup: function(s, num) {
            var re = '';
            for (var i = 0; i < num; i++)
            re = re + s;
            return re;
        },
        //---------------------------------------------------------------------------------------
        contains: function(array, o) {
            if (!$.isArray(array) || !o) return false;
            for (var i = 0; i < array.length; i++)
            if (array[i] == o) return true;
            return false;
        },
        //---------------------------------------------------------------------------------------
        // 让字符串居左对齐
        alignl: function(s, width, by) {
            if (typeof s != 'string') s = '' + s;
            if (!by) by = ' ';
            if (s.length < width) return s + z.dup(by, width - s.length);
            return s;
        },
        //---------------------------------------------------------------------------------------
        // 让字符串居右对齐
        alignr: function(s, width, by) {
            if (typeof s != 'string') s = '' + s;
            if (!by) by = ' ';
            if (s.length < width) return this.dup(by, width - s.length) + s;
            return s;
        },
        //---------------------------------------------------------------------------------------
        startsWith: function(str, sub) {
            if (!str || !sub) return false;
            if (str.length < sub.length) return false;
            return str.substring(0, sub.length) == sub;
        },
        //---------------------------------------------------------------------------------------
        endsWith: function(str, sub) {
            if (!str || !sub) return false;
            if (str.length < sub.length) return false;
            return str.substring(str.length - sub.length, str.length) == sub;
        },
        //---------------------------------------------------------------------------------------
        /** 将给定字符串，变成 "xxx...xxx" 形式的字符串
         * @param str 字符串.
         * @param len 最大长度.
         * @return 紧凑的字符串.
         */
        brief: function(str, len) {
            if (!str || (str.length + 3) <= len) return str;
            var w = parseInt(len / 2);
            var l = str.length;
            return str.substring(0, len - w) + ' ... ' + str.substring(l - w);
        }
    });
})(window.jQuery, window.NutzUtil);