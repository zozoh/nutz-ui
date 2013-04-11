(function($) {

    // 对jQuery对象添加方法
    $.fn.extend({
        poppos: function(childClz, pos) {
            var parent = this;
            var child = parent.find(childClz);
            var left, top;

            //窗口的九个位置设置
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
            }else if(pos == "centerleft"){
                top = (parent.height() - child.height()) / 2;
                left = 0;
            }else if(pos == "topcenter"){
                top =0;
                left =(parent.width()-child.width())/2;
            }else if(pos == "centerright"){
                top = (parent.height()-child.height())/2;
                left = parent.width()-child.width();
            }else if(pos == "bottomleft"){
                top = parent.height()-child.height();
                left = 0;
            }else if(pos = "bottomcenter"){
                top = parent.height()-child.height();
                left = (parent.width()-child.width())/2;
            }else {
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