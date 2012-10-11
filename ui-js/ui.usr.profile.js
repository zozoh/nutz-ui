(function($, ui, $z){
/*
 * 提供一个用户信息的编辑界面
 *
 * 扩展点:
 *   - 无 -
 */
 // .......................................... 帮助函数：将 %NAME%:%CONF% 格式的字符串切割成对象
 var _nm_ = function(str) {
	var pos = str.indexOf(":");
	var conf = $.trim(str.substring(pos+1));
	var enums = $z.str.startsWith(conf, "=") ? $.trim(conf.substring(1)) : "";
	return pos>0 ? {
		text  : $.trim(str.substring(0, pos)),
		enums : enums,
		regex : enums ? "" : conf
	} : {
		text : $.trim(str),
		enums : enums,
		regex : enums ? "" : conf
	};
};
// .......................................... 开始定义控件
ui("usr.profile", {
	dft_option : {
		data : function(callback) {
			$z.ajax.get($z.ui.url("/u/get/me"), function(re){
				callback.call(this, re.data);
			});
		},
		saveValue : function(lnm, fnm, val) {
			$z.ajax.post($z.ui.url("/u/do/set/me"), {fnm:fnm, val:val}, function() {
				// TODO 成功
			});
		},
		brief : ["realName", "title", "slogan", "about"],
	    fields: {
	        "mail  : ^(\\w|\\d|[._-]){2,20}@(\\w|\\d|[_-]){2,20}[.](a-zA-Z){1,10}"
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
	            : ["birthday"],
	        "other"   
	            : ["sex:=male,female", 
	               "blood:=A,B,O,AB,"]
	    }
	},
	on_init : function(){
		// 获取用户数据
		var usr = this.data;
		// 开始渲染 ...
		var html = '<div class="usr-profile">';
		html += '<div class="usr-profile-brief cfloat">';
		html += '    <img src="' + $z.ui.url('/avata/u/' + usr.loginName + '/64x64') + '">'
		html += '    <b class="usr-profile-loginName">' + usr.loginName + '</b>';
		for(var i=0; i<this.option.brief.length; i++) {
			var nm = this.option.brief[i];
			if("about"==nm)
				continue;
			html += '<b class="usr-profile-brief-' + nm + '" fnm="brief.' + nm + '">';
			html += $z.obj.val(usr, "values.brief." + nm, "");
			html += '</b>';
		}
		html += '<a class="usr-profile-add">' + $z.ui.msg("usr.profile.add") + '</a>';
		html += '</div>';
		html += '<textarea class="usr-profile-brief-about" placeholder="' + $z.ui.msg("usr.profile.about") + '">';
		html += $z.obj.val(usr,"values.brief.about", "") + '</textarea>'
		html += '<div class="usr-profile-values">';
		for(var key in this.option.fields) {
			var pos = key.indexOf(":");
			var grpnm = pos>0 ? $.trim(key.substring(0, pos)) : key;
			var regex = pos>0 ? $.trim(key.substring(pos+1)) : "";
			// 获取值
			var obj = (usr.values || {})[grpnm];
			if(!obj)
				continue;
			obj = obj || {};
			html += '<div class="usr-profile-fields" regex="' + regex + '">';
			html += '    <h4>' + $z.ui.msg('usr.profile.field.' + grpnm) + '</h4>';
			for (var fldnm in obj) {
				var val = obj[fldnm];
				html += '<div class="usr-profile-fields-item cfloat">';
				html += '    <div class="usr-profile-fields-item-nm">';
				html += $z.ui.msg("usr.profile.field." + grpnm + "." + fldnm,  fldnm) + ":";
				html += '    </div>'
				html += '    <div class="usr-profile-fields-item-val">' + val + '</div>';
				if(!$z.str.endsWith(usr.email, val))
					html += '<a class="usr-profile-fields-item-del">' + $z.ui.msg("usr.profile.del") + '</a>'
				html += '</div>'; // ~ end .usr-profile-fields-item
			}
			html += '</div>'; // ~ end .usr-profile-fields
		}
		html += '</div>'
		html += '</div>';
		this.selection.html(html);
	},
	on_resize : function(w, h) {
		var jBrief = this.jq(".usr-profile-brief");
		var jAbout = this.jq(".usr-profile-brief-about").css("width", parseInt(w/2));
		var jValues = this.jq(".usr-profile-values");

		var wleft = w - jAbout.outerWidth();
		var hbottom = h - jBrief.outerHeight();
		jBrief.css("width", wleft);
		jValues.css({
			width : wleft,
			height : hbottom
		});
		jAbout.css("height", h);
	},
	on_ready : function() {
		// this.jq(".usr-profile-add").click();
	},
	events : {
		".usr-profile-add" : function(e) {
			e.stopPropagation();
			var bind = $z.ui.getBind(this);
			$(this).floatdiv({
				className : 'usr-profile-add-menu',
				dockAt : "LB",
				padding: 8,
				on_show   : function(div) {
					div.attr("usr-profile-bind-id", bind.ID);
					// 显示 brief
					for(var i=0; i<bind.option.brief.length; i++) {
						var nm = bind.option.brief[i];
						var jq = $('<div class="usr-profile-add-menu-brief-item"></div>').appendTo(div);
						jq.text($z.ui.msg("usr.profile." + nm)).attr("selector", ".usr-profile-brief-" + nm);
					}
					div.append('<div class="usr-profile-add-menu-hr"></div>');
					// 显示 fields
					for(var key in bind.option.fields) {
						var oNm = _nm_(key);
						var subs = bind.option.fields[key];
						var html = '<div class="usr-profile-add-menu-field-item">';
						html += '<b>' + $z.ui.msg("usr.profile.field." + oNm.text, oNm.text) + '</b>';
						html += '<ul class="cfloat">';
						for(var i=0; i<subs.length; i++) {
							var sub = _nm_(subs[i]).text;
							html += '<li field="' + (oNm.text + "." + sub) + '">';
							html += $z.ui.msg("usr.profile.field." + oNm.text + "." + sub, sub);
							html += '</li>'
						}
						html += '</ul>'
						html += '</div>';
						$(html).appendTo(div);
					}
					// 绑定处理事件
					div.delegate(".usr-profile-add-menu-brief-item", "click", on_show_brief);
					div.delegate(".usr-profile-add-menu-field-item li", "click", on_show_field);
				}
			});
		}
	}  // ~ end of "events:"
}); // ~ end of uiDef "usr.profile"
// .......................................... 添加菜单项的处理函数: brief
var on_show_brief = function(){
	var bindID = $(this).parents(".usr-profile-add-menu").attr("usr-profile-bind-id");
	var bind = ui("@" + bindID);
	var selector = $(this).attr("selector");
	var jq = bind.jq(selector);
	// 多文本信息
	if(jq[0].tagName == "TEXTAREA"){
		jq.select();
	}
	// 普通信息
	else {
		$z.be.editIt(jq, function(newval, oldval){
			if(newval == oldval)
				return;
			this.text(newval);
			$z.ajax.post($z.ui.url("/u/do/set/" + bind.data.loginName), {
				fnm : $(this).attr("fnm"),
				val : newval
			});
		});
	}
};
// .......................................... 添加菜单项的处理函数: field
var on_show_field = function(){

};
})(window.jQuery, window.NutzUI, window.NutzUtil);
