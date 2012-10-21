/**
 * 本文件将提供 Nutz-JS 最基本的帮助函数定义支持，是 Nutz-JS 所有文件都需要依赖的基础JS文件
 *
 * 本文件依赖:
 *   > jQuery 1.7 或者更新版本
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($) {
    window.NutzUtil = {
        /*
         * 根据对象，或函数，定义帮助函数
         * @param nms 一个名称空间，支持 "." 作为分隔
         */
        def: function(nms, obj) {
            // 确定所有的包都存在
            var nms = nms.split(/[.]/);
            var nm = nms[nms.length - 1]; // 最后一个包名
            var pkg = this; // 当前对象就是根包
            for (var i = 0; i < nms.length - 1; i++) {
                if (null == pkg[nms[i]]) {
                    pkg[nms[i]] = {};
                }
                pkg = pkg[nms[i]];
            }
            // 如果是一个简单的函数
            if ($.isFunction(obj)) {
                pkg[nm] = obj;
            }
            // 如果是复杂的对象
            else {
                pkg[nm] = $.extend(true, pkg[nm] ? pkg[nm] : {}, obj);
            }
        }
    };
    // 创建 NutzUtil 的别名
    window.$z = window.NutzUtil;
})(window.jQuery);