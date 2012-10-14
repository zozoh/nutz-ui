/**
 * 本文件将提供一组帮助程序员运行时调试信息的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *   > z.time.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    // window.LOG_LEVEL 可以控制本函数集的输出
    //  0 - 完全关闭
    //  1 - 仅警告   : warn
    //  2 - 普通    : info
    //  3 - 更多调试  : debug
    //  4 - 最详细的细节: trace
    if (typeof window.LOG_LEVEL == 'undefined') {
        window.LOG_LEVEL = 3;
    }
    $z.def('log', {
        out: function(level, msg) {
            if (!LOG_LEVEL) return;
            var str = level + ': ' + $z.time.nowstr() + ': ' + msg;
            // WebKit 浏览器特殊的控制台打印方法
            if (console && console.log) {
                console.log(str);
            } else {
                alert(str);
            }
        },
        w: function(msg) {
            if (window.LOG_LEVEL >= 1) this.out('W', msg);
        },
        i: function(msg) {
            if (window.LOG_LEVEL >= 2) this.out('I', msg);
        },
        d: function(msg) {
            if (window.LOG_LEVEL >= 3) this.out('D', msg);
        },
        t: function(msg) {
            if (window.LOG_LEVEL >= 4) this.out('T', msg);
        }
    });
})(window.jQuery, window.NutzUtil);