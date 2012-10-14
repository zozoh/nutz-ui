/**
 * 本文件将提供一组和窗口运行环境相关的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z) {
    $z.def('sys', {
        //---------------------------------------------------------------------------
        // 返回一个时间戳，其它应用可以用来阻止浏览器缓存
        timestamp: function() {
            return ((new Date()) + '').replace(/[ :\t*+()-]/g, '').toLowerCase();
        },
        //---------------------------------------------------------------------------
        winsz: function() {
            if (window.innerWidth) return {
                width: window.innerWidth,
                height: window.innerHeight
            };
            if (document.documentElement) return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        },
        //---------------------------------------------------------------------------
        // 获得当前系统当前浏览器中滚动条的宽度
        // TODO 代码实现的太恶心，要重构!
        scrollBarWidth: function() {
            if (!window.SCROLL_BAR_WIDTH) {
                var newDivOut = "<div id='div_out' style='position:relative;width:100px;height:100px;overflow-y:scroll;overflow-x:scroll'></div>";
                var newDivIn = "<div id='div_in' style='position:absolute;width:100%;height:100%;'></div>";
                var scrollWidth = 0;
                $('body').append(newDivOut);
                $('#div_out').append(newDivIn);
                var divOutS = $('#div_out');
                var divInS = $('#div_in');
                scrollWidth = divOutS.width() - divInS.width();
                $('#div_out').remove();
                $('#div_in').remove();
                window.SCROLL_BAR_WIDTH = scrollWidth;
            }
            return window.SCROLL_BAR_WIDTH;
        }
    });
})(window.jQuery, window.NutzUtil);