(function($, ui, $z){
/*
 * 提供一个用户信息的编辑界面
 *
 * 扩展点:
 *   - 无 -
 */
// .......................................... 开始定义控件
ui("usr.general", {
	on_init : function(){
		var html = '<div class="usr-general">';
		html += 'I am User general';
		html += '</div>';
		this.selection.html(html);
	},
	events : {
	},
	dft_option : {}
});
})(window.jQuery, window.NutzUI, window.NutzUtil);
