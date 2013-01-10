/**
 *
 */
(function($, ui, $z) {
    ui('', {
        // 依次触发 on_init -> on_show -> on_resize -> on_listen -> on_ready
        on_init: function() {
            var html = '';
            html += '';
            this.selection.append(html);
        },
        on_show: function() {

        },
        on_resize: function(w, h) {

        },
        on_listen: function() {

        },
        on_ready: function() {

        },
        on_depose: function() {
            this.selection.undelegate();
            this.selection.empty();
        },
        // 绑定事件
        events: {

        },
        // 自定义方法，通常作为与其他ui交互的接口
        methods: {

        }
    });
})(window.jQuery, window.NutzUI, window.NutzUtil);