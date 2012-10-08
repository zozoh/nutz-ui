(function($, ui, $z){
/*
 * 提供一个用户密码修改界面
 *
 * 扩展点:
 *   - 无 -
 */
// .......................................... 开始定义控件
ui("usr.pwd", {
	on_init : function(){
		var html = '<div class="usr-pwd">';
		html += '<table cellspacing="0" cellpadding="8">';
		html += '    <tr>';
		html += '        <td class="usr-pwd-fnm">' + this.msg('usr.pwd.old') + '</td>';
		html += '        <td><input class="usr-pwd-old usr-pwd-input"></td>';
		html += '    </tr>';
		html += '    <tr>';
		html += '        <td class="usr-pwd-fnm">' + this.msg('usr.pwd.new') + '</td>';
		html += '        <td><input class="pwd-new usr-pwd-input"><span class="pwd-tester"></span></td>';
		html += '    </tr>';
		html += '    <tr>';
		html += '        <td class="usr-pwd-fnm">' + this.msg('usr.pwd.re') + '</td>';
		html += '        <td><input class="pwd-re usr-pwd-input"><span class="pwd-verifier"></span></td>';
		html += '    </tr>';
		html += '    <tr>';
		html += '        <td>&nbsp;</td>';
		html += '        <td><a class="usr-pwd-submit diss">' + this.msg('usr.pwd.submit') + '</a></td>';
		html += '    </tr>';
		html += '</table>';
		html += '</div>';
		this.selection.html(html);
		this.selection.password({
			msg : function(key) {
				return $z.ui.msg(key);
			},
			on_ready : function() {
				$z.ui.getBind(this).selection.find(".usr-pwd-submit").addClass("usr-pwd-submit-on");
			},
			on_unmatch : function() {
				$z.ui.getBind(this).selection.find(".usr-pwd-submit").removeClass("usr-pwd-submit-on");
			}
		});
	},
	events : {
		".usr-pwd-submit-on" : function() {
			var bind = $z.ui.getBind(this);
			var form = {
				"old" : bind.selection.find(".usr-pwd-old").val(),
				"pwd" : bind.selection.find(".pwd-new").val()
			};
			// 对密码进行加密
			var pwd_encrypt_method = bind.option.encrypt;
			if(pwd_encrypt_method) {
				form = {
					"old" : CryptoJS[pwd_encrypt_method](form.old).toString(),
					"pwd" : CryptoJS[pwd_encrypt_method](form.pwd).toString(),
				};
			}
			// 提交请求
			$z.ajax.post(bind.url("/u/do/chgpwd"), form, function(re){
				$z.ui.info($z.ui.msg("usr.pwd.changed"));
			});
		}
	},
	dft_option : {}
});
})(window.jQuery, window.NutzUI, window.NutzUtil);
