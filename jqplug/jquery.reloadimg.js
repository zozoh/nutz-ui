/*
 * 如果宿主对象是 IMG，那么本插件将对其 src 进行刷新
 */
(function($) {
    $.fn.extend({
        reloadimg: function() {
            var timestamp = ((new Date()) + '').replace(/[ :\t*+()-]/g, '').toLowerCase();
            this.each(function() {
                var src = this.src;
                var pos = src.indexOf('?');
                if (pos > 0) src = src.substring(0, pos);
                this.src = src + '?' + timestamp;
            });
            return this;
        }
    });
})(window.jQuery);