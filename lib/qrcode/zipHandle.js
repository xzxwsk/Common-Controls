var onerror = function onerror(message) {
	console.error(message);
};
var zipBlob = function zipBlob(fileInfo, callback) {
	zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
		for(var i in fileInfo){
			zipWriter.add(fileInfo[i].fileName, new zip.BlobReader(fileInfo[i].blob), function() {
				console.log(i);
//				zipWriter.close(callback);
			});
		}
		
	}, onerror);
};
var makeCode = function makeCode (str, callback) {
	var div = document.createElement("div");
	var qrcode = new QRCode(div, {
		width : 100,
		height : 100,
		callback: callback
	});
	qrcode.clear();
	qrcode.makeCode(str);
};
var base64Img2Blob = function base64Img2Blob(code){
	var parts = code.split(';base64,');
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], {type: contentType});
};