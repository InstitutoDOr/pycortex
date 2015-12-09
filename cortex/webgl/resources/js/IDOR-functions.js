function extractValPixels( url ){
	var deferred = $.Deferred();
	
	PNG.load(url, function(png){
		var rgba = png.decodePixels();
		var valores = new Float32Array( rgba.buffer.slice(0) );
		var obj = {arr:valores, width:326, height:326};
		deferred.resolve( obj );
	} );
	
	return deferred;
}


