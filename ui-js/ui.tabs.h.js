(function($, ui, $z) {
	/*
	 * 横向标签布局控件
	 * 扩展点:
	 *   > arena : 右侧主绘制区域
	 */
	ui("tabs.h", {
		dft_option: {
			data: function(callback) {
				callback({
					"::abc": function(bind) {},
					"::xyz": function(bind) {}
				});
			}
		},
		events: {
			".tabs-h-chute-item": function() {
				// 设置样式
				if (!$(this).hasClass("tabs-h-chute-item-hlt")) {
					$(this).parent().children().removeClass("tabs-h-chute-item-hlt");
					$(this).addClass("tabs-h-chute-item-hlt");
				}
				// 调用对应的函数
				var bind = $z.ui.getBind(this);
				var key = $(this).attr("tabs-h-chute-key");
				var func = bind.data[key];
				if (typeof func == "function") func.call(this, bind);
			}
		},
		on_init: function() {
			var html = '<div class="tabs-h">';
			html += '<div class="tabs-h-chute">'
			var ao = $z.ui.ao();
			var myAo = $.extend(true, {}, ao);
			if (this.data) {
				var i = 0;
				for (var key in this.data) {
					// 自定义锚值
					myAo.uis['tabs.h'] = {
						hlt: i
					};
					// 输出
					var o = $z.ui.uname(key);
					html += '<a class="tabs-h-chute-item tabs-h-chute-' + i + ' ' + o.className + '"';
					html += '   href="#' + $z.ui.ao(myAo) + '"'
					html += '   tabs-h-chute-key="' + key + '">';
					html += o.text;
					html += '</a>';
					// 自增下标 ...
					i++;
				}
			}
			html += '</div>';
			html += '<div class="tabs-h-arena"></div>';
			html += '</div>';
			this.selection.html(html);
		},
		on_ready: function() {
			this.jq(".tabs-h-chute-" + ((this.ao.uis['tabs.h'] || {}).hlt || 0)).click();
		},
		gasket: function(nm) {
			return nm == "arena" ? this.jq(".tabs-h>.tabs-h-arena") : null;
		},
		on_resize: function(w, h) {
			var jChut = this.selection.children(".tabs-h").children(".tabs-h-chute");
			var jArena = this.selection.children(".tabs-h").children(".tabs-h-arena");
			var arenaWidth = w - jChut.outerWidth();
			jArena.css("width", arenaWidth);
		}
	});
})(window.jQuery, window.NutzUI, window.NutzUtil);