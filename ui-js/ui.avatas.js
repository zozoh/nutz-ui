(function($, ui, $z){
/*
 * 提供 n 个上传控件，以便可以编辑 n 种精度的头像，其中 n 默认为 3
 *
 * 扩展点:
 *   - 无 -
 */
// .......................................... 更新图片
// this 为 bind 对象
var doRefreshPic = function() {
	this.jq(".avatas-pic img").each(function(){
		var src = this.src;
		var pos = src.indexOf("?");
		if(pos>0)
			src = src.substring(0, pos);
		this.src = src + "?" + $z.sys.timestamp();
	});
};
// .......................................... 执行上传
// this 为 $("tr.avatas-form")
var doUpload = function(file, url, headers) {
	var bind = $z.ui.getBind(this);
	var jProcessing = this.find(".avatas-process")
						.removeClass("avatas-process-warn")
						.removeClass("avatas-process-done")
						.addClass("avatas-process-ing");
	var xhr = new XMLHttpRequest();
	// 检查
    if(!xhr.upload) {
        $z.ui.warn("XMLHttpRequest object don't support upload for your browser!!!");
        return;
    }
    // 进度回调
    xhr.upload.addEventListener("progress", function(e) {
        jProcessing.text("" + parseInt(e.loaded * 10000 / e.total)/100 + "%");
    }, false);

    // 完成的处理
    xhr.onreadystatechange = function(e) {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                doRefreshPic.call(bind);
                jProcessing.removeClass("avatas-process-ing")
                	.addClass("avatas-process-done")
                	.text($z.ui.msg("avata.upload.done"));
                $z.be.blinkIt(jProcessing, {
                	speed : 3000,
                	after : function(){this.text("");}
                });
            }
            // NND，上传出错啦 ~~~
            else {
                jProcessing.removeClass("avatas-process-ing")
                	.addClass("avatas-process-warn")
                	.text('Fail to upload "' + file.name + '"\n\n' + xhr.responseText);
             	$z.be.blinkIt(jProcessing);   
            }
        }
    };

	// 准备请求对象头部信息
	var contentType = "application/x-www-form-urlencoded; charset=utf-8";
	xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', contentType)
    xhr.setRequestHeader("xhr_FILE_NAME", "" + encodeURI(file.name));

    // 加入更多的头信息
    if(headers){
    	for(var key in headers) {
			xhr.setRequestHeader("xhr_" + key, "" + encodeURI(headers[key]));
    	}
    }

    // 执行上传
    xhr.send(file);
};

// .......................................... 开始定义控件
ui("avatas", {
	on_init : function(){
		var imgsrc = this.url("/avata/" + this.option.cate + "/" + this.option.nm + "/");

		var html = '<div class="avatas">';
		html += '<div class="avatas-tip">' + this.msg('avata.tip') + '</div>'
		html += '<div class="avatas-forms"><table border="0" cellspacing="1">'
		for(var i=0; i<this.option.sizes.length; i++){
			var sz = this.option.sizes[i];
			var m = /^([0-9]+)([xX])([0-9]+)$/.exec(sz);
			var w = m[1] * 1;
			var h = m[3] * 1;
			var trID = this.ID + sz;
			html += '<tr avata-sz="' + sz + '" valign="top" class="avatas-form">';
			html += '    <td class="avatas-sz">' + sz + '</div>';
			html += '    <td class="avatas-pic"><img src="' + (imgsrc + sz) + '"';
			html += '        width="' + w + '" height="' + h + '"/></td>';
			html += '    <td class="avatas-uploader diss">';
			html += '        <div class="avatas-uploader-file">';
			html += '            <input type="file" accept="image/jpeg,image/gif,image/png">';
			html += '        </div>';
			html += '        <label for="' + trID + '">';
			html += '            <input id="' + trID + '" type="checkbox" checked>' + this.msg('avata.modi');
			html += '        </label>';
			html += '        <span class="avatas-uploader-btn">' + this.msg('avata.upload') + '</span>';
			html += '        <span class="avatas-process"></span>';
			html += '    </td>';
			html += '</tr>';
		}
		html += '</table></div>';
		html += '</div>';
		this.selection.html(html);
	},
	events : {
		".avatas-uploader-btn" : function(){
			// 首先获取文件对象
			var fInput = $(this).parents(".avatas-uploader").find(".avatas-uploader-file input")[0];
			if(fInput.files.length == 0){
				$z.ui.warn("avata.needfile");
				return;
			}
			// 然后得到 form 并执行上传
			var jq = $(this).parents(".avatas-form");
			var szs = [jq.attr("avata-sz")];
			if(jq.find(":checkbox")[0].checked){
				jq.nextAll().each(function(){
					szs.push($(this).attr("avata-sz"));
				});
			}
			var bind = $z.ui.getBind(jq);
			var opt = bind.option;
			var url = bind.url("/avata/upload");
			doUpload.call(jq, fInput.files[0], url, {
				cate : opt.cate,
				nm : opt.nm,
				szs : szs
			});
		}
	},
	dft_option : {
		sizes: ["128x128", "64x64", "32x32"],   // 请按照从大到小的顺序排列
		cate : "u",      // 分类，需要绑定时配置
		nm   : "zozoh"   // 名称，需要绑定时配置
	}
});
})(window.jQuery, window.NutzUI, window.NutzUtil);
