/** 
* each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数 
* 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回 


* @param {Function} fn 进行迭代判定的函数 
* @param more ... 零个或多个可选的用户自定义参数 
* @returns {Array} 结果集，如果没有结果，返回空集 
*/ 
Array.prototype.each = function(fn){ 
	fn = fn || Function.K; 
	var a = []; 
	var args = Array.prototype.slice.call(arguments, 1); 
	for(var i = 0; i < this.length; i++){ 
		var res = fn.apply(this,[this[i],i].concat(args)); 
		if(res != null) a.push(res); 
	} 
	return a; 
}; 

/** 
* 得到一个数组不重复的元素集合<br/> 
* 唯一化一个数组 
* @returns {Array} 由不重复元素构成的数组 
*/ 
Array.prototype.uniquelize = function(){ 
	var ra = new Array(); 
	for(var i = 0; i < this.length; i ++){ 
		if(!ra.contains(this[i])){ 
			ra.push(this[i]); 
		} 
	} 
	return ra; 
}; 

/** 
* 求两个集合的补集 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 两个集合的补集 
*/ 
Array.complement = function(a, b){ 
	return Array.minus(Array.union(a, b),Array.intersect(a, b)); 
}; 

/** 
* 求两个集合的交集 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 两个集合的交集 
*/ 
Array.intersect = function(a, b){ 
	return a.uniquelize().each(function(o){return b.contains(o) ? o : null}); 
}; 

/** 
* 求两个集合的差集 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 两个集合的差集 
*/ 
Array.minus = function(a, b){ 
	return a.uniquelize().each(function(o){return b.contains(o) ? null : o}); 
}; 

/** 
* 求两个集合的并集 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 两个集合的并集 
*/ 
Array.union = function(a, b){ 
	return a.concat(b).uniquelize(); 
}; 

//数组是否包含元素
Array.prototype.contains=function(obj) {
  var index=this.length;
  while (index--){
    if(this[index]===obj){
      return true;
    }
  }
  return false;
}

/* 
 *  方法:Array.remove(dx) 
 *  功能:根据元素值删除数组元素. 
 *  参数:元素值 
 *  返回:在原数组上修改数组 
 *  作者：pxp 
 */  
Array.prototype.indexOf = function (val) {  
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) {  
            return i;  
        }  
    }  
    return -1;  
};  
Array.prototype.removeValue = function (val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
};  
  
/* 
 *  方法:Array.remove(dx) 
 *  功能:根据元素位置值删除数组元素. 
 *  参数:元素值 
 *  返回:在原数组上修改数组 
 *  作者：pxp 
 */  
Array.prototype.remove = function (dx) {  
    if (isNaN(dx) || dx > this.length) {  
        return false;  
    }  
    for (var i = 0, n = 0; i < this.length; i++) {  
        if (this[i] != this[dx]) {  
            this[n++] = this[i];  
        }  
    }  
    this.length -= 1;  
};  

//创建哈希数组
function HashTable(){ 
	this._hash = {}; 
	this._count = 0; 
	this.add = function(key, value){ 
		if (this._hash.hasOwnProperty(key)) return false; 
		else { 
			this._hash[key] = value; 
			this._count++; 
			return true; 
		}
	} 
	this.remove = function(key) {
		delete this._hash[key]; 
		this._count--; 
	}
	this.count = function() { return this._count; } 
	this.items = function(key) { 
		if (this.contains(key)) return this._hash[key]; 
	}
	this.contains = function(key) { return this._hash.hasOwnProperty(key); } 
	this.clear = function() { 
		this._hash = {}; 
		this._count = 0; 
	}
}

//查看一个函数的执行时间
function testFuncTime(func){
    var start = new Date().getTime();//起始时间
    func();//执行待测函数
    var end = new Date().getTime();//接受时间
    var resultTime = (end - start)+"ms";
    console.log(resultTime);
    return resultTime;//返回函数执行需要时间
}