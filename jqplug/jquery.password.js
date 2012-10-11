/*
 * 用户密码输入校验器
 *
 * 本插件，将在选区内控制如下 DOM 对象:
 *   - input.pwd-new    : 新密码输入框
 *   - input.pwd-re     : 二次密码输入框
 *   - .pwd-tester      : 密码强度指示器
 *   - .pwd-verifier    : 两次输入密码一致性指示器
 * 本插件需要的语言字符串
 *   - pwd.unmatch
 *   - pwd.strong
 *   - pwd.weak
 *
 * 本插件接受配置对象格式为:
 * {
 *      on_ready  : function(pwd){...},             # this 为 .pwd-new, 参数 pwd 为密码
 *      on_unmatch: function(jPwdNew, jPwdRe){...}, # this 为选区，两个参数分别表示两个密码框的 jq 对象
 *      msg       : function(key){...}              # 获取多国语言字符串
 * }
 */
(function($){
	// 本函数将检验密码是否一致（如果二次密码不为空），以及指示出密码强度
	function _do_check(selection, opt){
		var jPwdNew = selection.find("input.pwd-new");
		var jPwdRe = selection.find("input.pwd-re");
		var pwd = jPwdNew.val();
		var pwdRe = jPwdRe.val();
		// 先检测密码强度
		var m = !pwd || pwd.length<6 ? 0 : 
						/[0-9]/.test(pwd)*1 + /[a-z]/.test(pwd)*1
						+ /[A-Z]/.test(pwd)*1 + /[^0-9a-zA-Z]/.test(pwd)*1;
		$(selection.find(".pwd-tester .pwd-test-cell").removeClass("pwd-test-on")[m])
			.prevAll(".pwd-test-cell").andSelf()
			.addClass("pwd-test-on");

		// 如果两者一致 ...
		if(pwdRe && pwd && pwdRe==pwd){
			jPwdRe.removeClass("pwd-invalid");
			selection.find(".pwd-verifier").empty();
			if(typeof opt.on_ready == "function")
				opt.on_ready.call(jPwdNew, pwd);
		}
		// 否则 ...
		else if(pwdRe) {
			jPwdRe.addClass("pwd-invalid");
			selection.find(".pwd-verifier").text(opt.msg("pwd.unmatch"));
			if(typeof opt.on_unmatch == "function")
				opt.on_unmatch.call(selection, jPwdNew, jPwdRe);
		}
	}
	// 扩展插件
	$.fn.extend({
		password : function(opt){
			opt = opt || {msg : function(key){return key;}};
			var selection = this;

			// 首先绘制一个打分的框框
			var html = '<table cellspacing="1" cellpadding="0"><tr>';
			html += '<td class="pwd-title pwd-title-weak">' + opt.msg('pwd.weak') + '</td>';
			for(var i=0; i<5; i++){
				html += '<td class="pwd-test-cell">&nbsp;</td>';
			}
			html += '<td class="pwd-title pwd-title-strong">' + opt.msg('pwd.strong') + '</td>';
			html += '</tr></table>';
			selection.find(".pwd-tester").html(html);

			// 监视新密码输入动作
			this.delegate("input.pwd-new", "keyup", function(){
				_do_check(selection, opt);
			});
			// 监视二次密码输入动作
			this.delegate("input.pwd-re", "keyup", function(){
				_do_check(selection, opt);
			});
			return this;
		}
	});
})(window.jQuery);