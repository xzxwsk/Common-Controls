/**
 * 封装页面请求
 * 备注：基于jquery请求对所有请求做对应的封装。每个页面需要先引用jquery.js
 * @param type  0：get, 1：post, 2：getJSON(跨域问题,只提供get方式)。
 * @param url 提交地址,绝对全路径。
 * @param params 请求参数(为了方便这里用字符串组装方式提供).格式："key="+key +"&mac="+mac 。
 * @param callback 回调函数。这里多个请求时
 * @param async true：异步, false ：同步。
 */
function postData(type, url, params, callback, async) {
	//默认为异步提交
	if(async === undefined){
		async = true;
	}
	if(type === 0){
		getOrPost("GET", url, params, callback, async);
	}else if(type === 1){
		getOrPost("POST", url, params, callback, async);
	}else if(type === 2){
		 //跨域请求
		getJSONP(url, params, callback);
	}
}

function getJSONP(url, params, callback){
//	if(url.indexOf("?") > 0 ){
//		url = url + "&callback=?";
//	}else{
//		url = url + "?callback=?";
//	}
//	$.getJSON(url,callback);
	var jsonpPara = "callback";
	if(null != params && undefined != params && undefined != params.jsonp){
		jsonpPara = params.jsonp;
	}
	var jsonpCallbackPara = "jsonpCallback";
	if(null != params && undefined != params && undefined != params.jsonpCallback){
		jsonpCallbackPara = params.jsonpCallback;
	}
	if(null != params && undefined != params){
		if(null != params.jsonp && undefined != params.jsonp){
			delete params.jsonp;
		}
		if(null != params.jsonpCallback && undefined != params.jsonpCallback){
			delete params.jsonpCallback;
		}
	}
	$.ajax({
		 type : "post",
		 url : url,  
		 data : params,
		 dataType : "jsonp",
		 success : callback,
		 jsonp: jsonpPara,
		 jsonpCallback: jsonpCallbackPara,
		 error : function(resData) {
			 if(resData.readyState == 4){
				 console.log("jsonp参数key与后台不一致");
			 }
		 }  
	 });
}
//默认的编码设置
var contentTypeDef = "application/x-www-form-urlencoded; charset=utf-8";
/**
 * 统一UTF-8编码
 * @param type
 * @param url
 * @param params
 * @param callback
 * @param async
 */
function getOrPost(type, url, params, callback, async){
	 $.ajax({
		 type : type,
		 async : async,
		 contentType: contentTypeDef,   
		 url : url,  
		 data : params,
		 dataType : "json",
		 //这里通过返回数据判断成功或者失败
		 //complete : callback  
		 success :callback,
		 timeout: 15*1000,
		 cache: false,
		 error : function(data) {   
			 if(data.status === 401){
				 alert("请重新登录"); 
				 return;
			 }
			//alert("请求失败,请重新尝试!");
			var temp = '{"status":"-1"}';
			//转化为json
			data = eval('(' + temp + ')');
			eval(callback(data));
		 }  
	 });
}