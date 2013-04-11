$(document).ready(function() {

    $(document.body).css('height', window.innerHeight);

    //选区在 右下角从下往上弹出
    $(document.body).popwin({
        'width': 200,
        'height': 100,
        'pos': 'bottomright',
        'effect': 'bottom2top',
        'duration': 500,
        'childFunc': function() {
            var html = '<div class="qqtip"></div>';
            return $(html);
        },
        'fadeFunc': function(pop) {
            pop.live('click', function() {
                pop.fadeOut(function() {
                    pop.remove();
                });
            });
        }
    });

    //选区从左上角淡出
    $(document.body).popwin({
        'width': 200,
        'height': 100,
        'pos': 'topleft',
        'effect': 'fadeIn',
        'duration': 500,
        'childFunc': function() {
            var html = '<div class="qqtip2"></div>';
            return $(html);
        },
        'fadeFunc': function(pop) {
            // pop.live('click', function(){
            //     pop.fadeOut(function(){
            //         pop.remove();
            //     });
            // });
            setTimeout(function(){
                pop.fadeOut(function(){
                    pop.remove();
                })
            }, 3000);
        }
    });

    //选区在左下角由左向右弹出
    $(document.body).popwin({
        'width': 200,
        'height': 100,
        'pos': 'bottomleft',
        'effect': 'lefttoright',
        'duration': 500,
        'childFunc': function() {
            var html = '<div class="qqtip3"></div>';
            return $(html);
        },
        'fadeFunc': function(pop) {
            pop.live('click', function() {
                pop.fadeOut(function() {
                    pop.remove();
                });
            });
        }
    });

    //选区右上角围绕浏览器绕一圈
    $(document.body).popwin({
        'width': 200,
        'height': 100,
        'pos': 'topright',
        'effect': 'around',
        'duration': 500,
        'childFunc': function() {
            var html = '<div class="qqtip4"></div>';
            return $(html);
        },
        'fadeFunc': function(pop) {
            setTimeout(function(){
                pop.fadeOut(function(){
                    pop.remove();
                })
            }, 1);
        }
    });

});