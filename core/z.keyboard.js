/**
 * 本文件将提供一组对于 window 键盘的监视函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    // 得到操作系统信息
    var str = (window.navigator.userAgent + '').toLowerCase();
    window.os = {
        mac: str.match(/.*mac os.*/) ? true : false,
        pc: str.match(/.*mac os.*/) ? false : true
    };
    //---------------------------------------------------------------------------------------
    // 键盘映射
    var KEYS = {
        '16': 'shift',
        '18': 'alt'
    };
    if($.browser.webkit) {
        KEYS[os.mac ? '91' : '17'] = 'ctrl';
    } else {
        KEYS[os.mac && !$.browser.opera ? '224' : '17'] = 'ctrl';
    }
    // 开始定义帮助函数集
    $z.def('keyboard', {
        /*
         * 监视键盘，本函数会根据键盘的状态，为 ".keyboard-info" 对象加入:
         *  - .keyboard-on-ctrl
         *  - .keyboard-on-shift
         *  - .keyboard-on-alt
         */
        watch: function() {
            if(!window.keyboard) {
                window.keyboard = {};
                // 监视键盘事件
                $(window).keydown(function(e) {
                    var key = KEYS['' + e.which];
                    if(key) {
                        window.keyboard[key] = true;
                        $('.keyboard-info').addClass('keyboard-on-' + key);
                    }
                }).keyup(function(e) {
                    var key = KEYS['' + e.which];
                    if(key) {
                        window.keyboard[key] = false;
                        $('.keyboard-info').removeClass('keyboard-on-' + key);
                    }
                });
            }
        }
    }); // ~ 结束定义帮助函数集
})(window.jQuery, window.NutzUtil);