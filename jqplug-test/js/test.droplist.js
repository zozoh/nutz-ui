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
        nodata: {
            txt: '无数据',
            val: '_'
        },
        sel_draw: true,
        filter: function(dl_item){

        },
        paging_mode: "V"
    });

    // 普通下拉
    $('.d2').droplist({
        sel_click_cls : '.d2_sel',
        paging_mode: "H"
    });

    // 普通下拉
    $('.d3').droplist({
        sel_draw: true,
        paging_mode: "S"
    });

    // 普通下拉
    $('.d4').droplist({
        sel_draw: true,
        paging_mode: "S",
        filter: function(dl_item){

        }
    });
});