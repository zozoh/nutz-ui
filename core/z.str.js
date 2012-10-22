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
            for (var i = 0; i < num; i++) {
                re = re + s;
            }
            return re;
        },
        //---------------------------------------------------------------------------------------
        contains: function(array, o) {
            if (!$.isArray(array) || !o) {
                return false;
            }
            for (var i = 0, j = array.length; i < j; i++) {
                if (array[i] == o) {
                    return true;
                }
            }
            return false;
        },
        //---------------------------------------------------------------------------------------
        // 让字符串居左对齐
        alignl: function(s, width, by) {
            if (typeof s != 'string') {
                s = '' + s;
            }
            if (!by) {
                by = ' ';
            }
            if (s.length < width) {
                return s + z.dup(by, width - s.length);
            }
            return s;
        },
        //---------------------------------------------------------------------------------------
        // 让字符串居右对齐
        alignr: function(s, width, by) {
            if (typeof s != 'string') {
                s = '' + s;
            }
            if (!by) {
                by = ' ';
            }
            if (s.length < width) {
                return this.dup(by, width - s.length) + s;
            }
            return s;
        },
        //---------------------------------------------------------------------------------------
        startsWith: function(str, sub) {
            if (!str || !sub) {
                return false;
            }
            if (str.length < sub.length) {
                return false;
            }
            return str.substring(0, sub.length) == sub;
        },
        //---------------------------------------------------------------------------------------
        endsWith: function(str, sub) {
            if (!str || !sub) {
                return false;
            }
            if (str.length < sub.length) {
                return false;
            }
            return str.substring(str.length - sub.length, str.length) == sub;
        },
        //---------------------------------------------------------------------------------------
        /**
         * 根据一个字节数，返回一个人类友好的显示，比如 xxxMB 等
         * unit 如果为 'M' 表示单位为M， 如果为 'K' 表示单位为 K
         */
        sizeText: function(size, unit) {
            if( typeof size != "number")
                size = size * 1;
            if("M" == unit) {
                var g = size / 1000;
                if(g > 1)
                    return Math.ceil(g * 10) / 10 + " GB";
                return size + "MB";
            }
            if("K" == unit) {
                var m = size / 1000;
                var g = m / 1000;
                if(g > 1)
                    return Math.ceil(g * 10) / 10 + " GB";
                if(m > 1)
                    return Math.ceil(m * 10) / 10 + " MB";
                return Math.ceil(k) + " KB";
            }
            var k = size / 1000;
            if(k > 1) {
                var m = k / 1000;
                var g = m / 1000;
                if(g > 1)
                    return Math.ceil(g * 10) / 10 + " GB";
                if(m > 1)
                    return Math.ceil(m * 10) / 10 + " MB";
                return Math.ceil(k) + " KB";
            }
            return size + " B";
        },
        //---------------------------------------------------------------------------------------
        /** 将给定字符串，变成 "xxx...xxx" 形式的字符串
         * @param str 字符串.
         * @param len 最大长度.
         * @return 紧凑的字符串.
         */
        brief: function(str, len) {
            if (!str || (str.length + 3) <= len) {
                return str;
            }
            var w = parseInt(len / 2);
            var l = str.length;
            return str.substring(0, len - w) + ' ... ' + str.substring(l - w);
        }
    });
})(window.jQuery, window.NutzUtil);