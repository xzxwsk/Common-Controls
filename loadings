function loadingFun() {
    this.initialize.apply(this, arguments)
}
loadingFun.prototype = {
    initialize: function(id) {
    	var _this = this;
    	$("#"+id).append('<div class="loading display-none"><div class="loading_inner"><a><span class="text">正在加载中...</span></a></div></div>');    	
    	$("#"+id).css("position","relative");
    	this.loadingDiv = $("#"+id).children(".loading");
    	this._hide = function(){
    		return _this.hide.apply(_this);
    	};
//    	this.addEvent($(this.loadingDiv).children(), "click", this._hide);
    },
    show: function(text){
    	$(this.loadingDiv).removeClass("display-none");
    	if(text){
    		$(this.loadingDiv).find(".text").text(text);
    	}
    },
    hide: function(){
    	$(this.loadingDiv).addClass("display-none");
    },
    addEvent: function(_oElement, sEventType, fnHandler) {
    	var oElement = _oElement[0];
        return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
    }
}
