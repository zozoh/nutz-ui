/*
 * 提供一个 n 行 n 列的扩展区域
 *
 * 扩展点:
 *   [g0_0] [g0_1] [g0_2]
 *   [g1_0] [g1_1] [g1_2]
 */
(function($, ui, $z) {
    // .......................................... 帮助函数
    // 分配尺寸，自动计算 '*'

    function _assign_size(sum, list) {
        var array = [];
        for (var i = 0; i < list.length; i++) {
            array[i] = list[i];
        }
        // 统计一下有多少的项目是要自动计算的
        var asnum = 0;
        var remain = sum;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == '*') {
                asnum++;
            } else {
                remain -= array[i];
            }
        }
        // 计算一下
        if (asnum > 0) {
            var avg = parseInt(remain / asnum);
            var total = 0;
            var lastIndex = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i] == '*') {
                    array[i] = avg;
                    lastIndex = i;
                }
                total += array[i];
            }
            // 最后分配剩余的大小
            if (total != sum) {
                array[lastIndex] += (sum - total);
            }
        }
        return array;
    }
    // .......................................... 开始定义控件
    ui('cells', {
        dft_option: {
            // 'cols': ['*', '*', 200],
            // 'rows': [30, '*']
        },
        gasket: function(nm) {
            var jRows = this.selection.children('.cells').children('.cells-row');
            for (var i = 0; i < jRows.size(); i++) {
                var jCell = $(jRows[i]).children('.cell-id-' + nm);
                if (jCell.size() > 0) {
                    return jCell;
                }
            }
            return null;
        },
        on_init: function() {
            var html = '<div class="cells ' + (this.option.className || '') + '">';
            for (var i = 0; i < this.option.rows.length; i++) {
                html += '<div class="cells-row">';
                for (var j = 0; j < this.option.cols.length; j++) {
                    html += '<div class="cells-cell cell-id-g' + i + '_' + j + '"></div>';
                }
                html += '</div>';
            }
            html += '</div>';
            this.selection.html(html);
            this.jq('.cells').css({
                'width': '100%',
                'height': '100%',
                'position': 'relative',
                'overflow': 'hidden'
            });
            this.jq('.cells-cell').css({
                'position': 'absolute'
            });
        },
        on_resize: function(sumW, sumH) {
            // 分配宽高
            var cols = _assign_size(sumW, this.option.cols);
            var rows = _assign_size(sumH, this.option.rows);
            // 开始设置
            var top = 0;
            var jq = this.selection.children('.cells');
            for (var i = 0; i < rows.length; i++) {
                var H = rows[i];
                var left = 0;
                var jRow = $(jq.children('.cells-row')[i]);
                for (var j = 0; j < cols.length; j++) {
                    var jCell = $(jRow.children('.cells-cell')[j]);
                    var W = cols[j];
                    // 设置 CSS
                    jCell.css({
                        'width': W,
                        'height': H,
                        'left': left,
                        'top': top
                    });
                    left += cols[j];
                }
                top += rows[i];
            }
        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);