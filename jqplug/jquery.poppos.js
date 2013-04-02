(function($) {

    // 对jQuery对象添加方法
    $.fn.extend({
        poppos: function(childClz, pos) {
            var parent = this;
            var child = parent.find(childClz);
            var left, top;
            if (pos == "center") {
                top = (parent.height() - child.height()) / 2;
                left = (parent.width() - child.width()) / 2;
            } else if (pos == "topleft") {
                top = 0;
                left = 0;
            } else if (pos == "topright") {
                top = 0;
                left = parent.width() - child.width();
            } else if (pos == "bottomright") {
                top = parent.height() - child.height();
                left = parent.width() - child.width();
            } else {
                // do nothing
                top = child.css('top');
                left = child.css('left');
            }

            child.css({
                'top': top,
                'left': left
            });
        }
    });
})(window.jQuery)