"use strict";

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var fnImageCrop = function(options, fun, obj){
    	if(obj.length < 1){
    		return;
    	}
    	var si = null,
			serverUrl = "http://cimg.eluyou.cc",//服务接口地址
//			serverUrl = "http://192.168.1.106:8081/imagecut",
			jcrop_api = null,	
			_ImgType = options.ImgType ? options.ImgType : "jpeg,jpg,bmp,png",
			_imgTypeAccept = "";//文件限制类型
    	var setSelectArea = function(coords) {
			var x, y, width, height;
			var ratio = $('#cutImgPop #cropImg').data("ratio");
			if (parseInt(coords.w) > 0) {
				var x = Math.floor(parseInt(coords.x) * ratio);
				var y = Math.floor(parseInt(coords.y) * ratio);
				var width = Math.ceil(parseInt(coords.w) * ratio);
				var height = Math.ceil(parseInt(coords.h) * ratio);
			}
			$("#cutImgPop #x").val(x);
			$("#cutImgPop #y").val(y);
			$("#cutImgPop #width").val(width);
			$("#cutImgPop #height").val(height);
		};
		var getCenterCoordinate = function(_jcrop_api){
			var dim = _jcrop_api.getBounds();
			var _width = parseInt(dim[0]/2);
			var _height = parseInt(dim[1]/2);
			var x1 = Math.round((dim[0]-_width)/2);
			var y1 = Math.round((dim[1]-_height)/2);
			var x2 = x1+_width;
			var y2 = y1+_height;
			console.log([ x1, y1, x2, y2 ]);
			return [ x1, y1, x2, y2 ];
		};
		var init = function(){
    		var sInnerHtml = "";
    		if ($("#cutImgPop").length < 1) {
    			sInnerHtml = '<div class="modal fade" id="cutImgPop" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true" data-backdrop="static">'
				+ '<div class="modal-dialog" style="width:630px;">' 
					+ '<div class="modal-content">' 
						+ '<div class="modal-header clearfix">'
							+ '<a class="close" data-dismiss="modal">&times;</a>' 
							+ '<div class="modal-title">图片处理</div>' 
						+ '</div>' 
						+ '<div class="modal-body clearfix">'
	    					+ '<div class="container col-xs-12">'
								+ '<div id="fileForm">'
									+ '<div class="row">'
										+ '<input type="button" value="上传图片" name="file_upload" id="file_upload" />'
										+ '<input type="hidden" name="accno" id="accno" />'
										+ '<input type="hidden" name="key" id="key" />'
										+ '<input type="hidden" name="sign" id="sign" />'
									+ '</div>'
								+ '</div>'
								+ '<div class="row">'
									+ '<div class="progress" style="display:none;margin-top:20px;margin-bottom:0;">'
									  + '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">'
									    + '<span class="sr-only">0% Complete</span>'
									  + '</div>'
									+ '</div>'
								+ '</div>'
								+ '<form name="dataForm" id="dataForm" method="post">'
									+ '<div class="row">'
										+ '<br /> <img id="cropImg" style="display: none;max-width: 500px;max-height: 500px;" />'
										+ '<input type="hidden" name="x" id="x" />'
										+ '<input type="hidden" name="y" id="y" />'
										+ '<input type="hidden" name="width" id="width" />'
										+ '<input type="hidden" name="height" id="height" />'
										+ '<input type="hidden" name="filekey" id="filekey" />'
									+ '</div>'
								+ '</form>'
							+ '</div>'
						+ '</div>'
						+ '<div class="modal-footer">'
							+ '<span class="pull-left"><font color="#999">鼠标可框选图片进行剪切</font></span>'
							+ '<input type="button" value="取消" class="btn" data-dismiss="modal" />'
							+ '<input type="submit" value="确定" class="btn btn-primary" id="cutImgConfirm" />' 
						+ '</div>' 
					+ '</div>' 
				+ '</div>' 
			+ '</div>';

    			$("body").append(sInnerHtml);

    			$("#cutImgPop").modal("show");
    			$("#cutImgPop #cutImgConfirm").click(function() {
    				//点击确定时提交截图参数
					$.ajax({
						dataType : "jsonp",
						type : "post",
						url : serverUrl+"/cutImage",
						data : $("#dataForm").serialize(),
						jsonp:'callback',  
						jsonpCallback:'getData',
						beforeSend : function() {
							if("" == $("#cutImgPop #filekey").val() || undefined == $("#cutImgPop #filekey").val()){
								alert("请选择图片");
								return false;
							}
						},
						success : function(info) {
							if (info.status == "error") {
								alert("上传失败!");
							} else {
								fun(info);//调用该插件回调函数
								$("#cutImgPop").modal("hide");
								setTimeout(function(){
									$("#cutImgPop .progress").hide();
									$("#cutImgPop .progress-bar").width("0%");
									$("#cutImgPop .sr-only").text("0% Complete");
								},500);						
							}
						},
						error : function(info) {
							alert("网络连接失败，请稍后再试!");
						}
					});
    			});
    		}
    		$('#cutImgPop').on('hide.bs.modal', function() {
    			setTimeout(function() {
    				$("#cutImgPop").remove();
    			}, 500);
    		});
    		
			options = jQuery.extend({}, {
				aspectRatio : 0,
				allowSelect : true,
				allowResize : true,
				allowMove : true,
				keySupport : false,
				boxWidth : 600,
				boxHeight : 600,
				minSize : [ 10, 10 ],
				maxSize : [ 350, 350 ],
				onSelect : setSelectArea
			}, options);
			

			var uploader = new plupload.Uploader({
				runtimes : 'html5,flash,silverlight',
				browse_button : 'file_upload', // you can pass an id...
				file_data_name : "file_upload",
				container: document.getElementById('fileForm'), // ... or DOM Element itself
				url : serverUrl+"/saveImage",
				multi_selection : false,
				multipart_params: {
					key: options.key,
					accno: options.accno,
					sign: options.sign
				},
//				flash_swf_url : serverUrl+'/resources/js/Moxie.swf',
//				silverlight_xap_url : serverUrl+'/resources/js/Moxie.xap',
				flash_swf_url : options.flash_swf_url,
				silverlight_xap_url : options.silverlight_xap_url,
				
				filters : {
					max_file_size : (options.max_file_size ? options.max_file_size : "2mb"),
					mime_types: [
						{title : "Image files", extensions : _ImgType}
					]
				},
			
				init: {
					FilesAdded: function(up, files) {
						$("#cutImgPop .progress").show();
						uploader.start();
					},
					
					UploadProgress: function(up, file) {
						$("#cutImgPop .progress-bar").width(file.percent+"%");
						$("#cutImgPop .sr-only").text(file.percent+"% Complete");
					},
					
					FileUploaded: function(up, file, res) {
						var info = JSON.parse(res.response);
						if (info.status != "success") {
							$("#cutImgPop").modal("hide");
							alert(info.msg);
						}else{
							if (jcrop_api) {
								jcrop_api.destroy();
								jcrop_api = null;
							}
							$('#cutImgPop #cropImg').removeAttr("style");	
							$("#cutImgPop #cropImg").attr("src", info.url).show();//预览文件
							$('#cutImgPop #cropImg').css("max-width", options.boxWidth);//设置缩放大小
							$('#cutImgPop #cropImg').css("max-height", options.boxHeight);
							$("#cutImgPop #filekey").val(info.filekey);
							var imgTemp = new Image();
							imgTemp.src = info.url;
							imgTemp.onload = function(){					
								//获取图片缩放比例
								var _ratio = Math.max(1, this.width/$('#cutImgPop #cropImg').width());
								
								setTimeout(function(){
									$("#cutImgPop .progress").fadeOut();
								},1000);
								//设置图片缩放后的大小，以供截图插件占用比例
								$('#cutImgPop #cropImg').width($('#cutImgPop #cropImg').width());
								$('#cutImgPop #cropImg').height($('#cutImgPop #cropImg').height());
								$('#cutImgPop #cropImg').data("ratio", _ratio);//缓存比例
								jcrop_api = $.Jcrop('#cutImgPop #cropImg', options);//初始化截图插件
								jcrop_api.setSelect(getCenterCoordinate(jcrop_api));
							}
						}
					},
			
					Error: function(up, err) {
						$("#cutImgPop").modal("hide");
						switch (err.code){
							case -600:
								alert("文件太大，不能超过"+options.max_file_size);
								break;
							case -601:
								alert("文件名类型不符，只能上传"+_ImgType);
								break;
							default:
								alert("出错了，请稍候再试！");
						}
					}
				}
			});
			
			uploader.init();
    	};
    	obj.on("click",function(){
    		init();
    	});
    };
    jQuery.fn.fnImageCrop = function(options, fun){
    	if(arguments.length < 2){
    		var fun = options;
    		options = {};
    	}
        return new fnImageCrop(options, fun, this);
    };
}));