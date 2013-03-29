(function($) {

    // 对jQuery对象添加方法
    // $.fn.extend({
    //     position: function(childClz) {
    //         var parent = this;
    //         var child = parent.find(childClz);
    //         var left = (parent.width() - child.width()) / 2;
    //         var top = (parent.height() - child.height()) / 2;

    //         child.css({
    //             'top': top,
    //             'left': left
    //         });
    //     }
    // });

    // 添加到jQuery本身的方法
    $.extend({
        position: function(pClz, cClz, pos) {
            var parent = $(pClz);
            var child = parent.find(cClz);
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
            } else {
                // do nothing
            }

            child.css({
                'top': top,
                'left': left
            });
        }
    });


})(window.jQuery)