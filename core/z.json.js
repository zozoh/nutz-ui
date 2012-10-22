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
    $z.def('json', {
        toJson: function(obj, filter, tab) {
            return JSON.stringify(obj, filter, tab);
        },
        fromJson: function(jsonStr, fltFunc) {
            if (!jsonStr) return null;
            return JSON.parse(jsonStr, fltFunc);
        }
    });
})(window.jQuery, window.NutzUtil);