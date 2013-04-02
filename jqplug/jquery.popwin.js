(function($) {

    // opt 格式如下
    // {
    //     'width': 100,
    //     'height': 200,
    //     'pos': 'center',
    //     'effect': 'fadein',
    //     'duration': 200,
    //     'childFunc': function() {},
    //     'fadeFunc': function(pop) {}
    // }

    var NUM = 0;

    function next() {
        NUM++;
        return "pp" + NUM;
    }

    $.fn.extend({
        popwin: function(opt) {

            var body = $(this);

            var id = next();

            // 绘制选区
            var pphtml = '';
            pphtml += '<div class="pop ' + id + '">';
            pphtml += '   <div class="pop-container">';
            pphtml += '   </div>';
            pphtml += '</div>';
            body.append(pphtml);

            // 选区设置宽高与位置
            var pp = body.find('.pop.' + id);
            pp.css({
                'width': opt.width,
                'height': opt.height
            });

            body.poppos('.pop.' + id, opt.pos);

            // 填充选区
            var child = opt.childFunc();
            body.find('.' + id + ' .pop-container').append(child);

            // 设置填充的动画效果 && 设置消失效果
            if ('fadeIn' == opt.effect) {
                child.hide();
                child.fadeIn("slow", function() {
                    opt.fadeFunc(pp);
                });
            } else if ('bottom2top' == opt.effect) {
                child.css({
                    'top': pp.height()
                });

                child.animate({
                    'top': 0
                }, opt.duration, function() {
                    opt.fadeFunc(pp);
                });
            }
        }
    });
})(window.jQuery)