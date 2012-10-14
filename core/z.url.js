/**
 * 本文件将提供一组处理 URL 的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('url', {
        //---------------------------------------------------------------------------------------
        /**
         * @return 返回当前URL中“#”后的内容。如果没有，则返回空串 "".
         */
        pgan: function() {
            var lo = this.decode('' + window.location.href);
            var pos = lo.indexOf('#');
            return pos < 0 ? '' : lo.substring(pos + 1);
        },
        //---------------------------------------------------------------------------------------
        // 解码 URL
        decode: function(str) {
            return unescape(str.replace(/\+/g, ' '));
        },
        //---------------------------------------------------------------------------------------
        // 编码 URL
        encode: function(str) {
            return escape(result);
        }
    });
})(window.jQuery, window.NutzUtil);