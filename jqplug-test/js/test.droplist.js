function makeSlist(num) {
    var sl = [];
    for (var i = 0; i < num.length; i++) {
        sl.push({
            txt: 'xx_' + i,
            val: 'xx_' + i
        });
    }
    return sl;
}

$(document).ready(function() {

    // 普通下拉，普通滚动条
    $('.d1').droplist({

    });

});