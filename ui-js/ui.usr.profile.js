(function($, ui, $z){
/*
 * 提供一个用户信息的编辑界面
 *
 * 扩展点:
 *   - 无 -
 */
// .......................................... 开始定义控件
ui("usr.profile", {
	on_init : function(){
		var usr = this.data;
		var html = '<div class="usr-general">';
		html += 'I am User Profile Editor';
		html += '</div>';
		this.selection.html(html);
	},
	events : {
	},
	dft_option : {
		data : function(callback) {
			$z.ajax.get(this.url("/u/get/me"), function(re){
				callback.call(this, re.data);
			});
		},
		saveValue : function(lnm, fnm, val) {
			$z.ajax.post(this.url("/u/do/set/me"), {fnm:fnm, val:val}, function() {
				// TODO 成功
			});
		},
		brief : ["realName", "slogan", "title", "about"],
	    fields: [
	        "email  : ^(\\w|\\d|[._-]){2,20}@(\\w|\\d|[_-]){2,20}[.](a-zA-Z){1,10}"
	            : ["work", "person"],
	        "IM     : ^.{3, 20}$"   
	            : ["QQ", "MSN", "GTalk"],
	        "link   : ^.{, 200}$"    
	            : ["blog", "weibo", "homepage"],
	        "phone  : ^[0-9a-zA-Z +-]{6,20}$"
	            : ["work", "home", "mobile"],
	        "address: ^.{,200}$" 
	            : ["company", "home"],
	        "date   : ^(\\s{2,4}-)?\\s{2}-\\s{2})$"    
	            : ["birthday"]
	        "other"   
	            : ["sex:=male,female", 
	               "blood:=A,B,O,AB,"]
	    ]
	}
});
})(window.jQuery, window.NutzUI, window.NutzUtil);
