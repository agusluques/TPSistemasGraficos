function Camera(){
	//var aspect = gl.viewportWidth / gl.viewportHeight;
	//var zNear = 1;
	//var zFar = 2000;
	var projectionMatrix = mat4.create();
	var mvMatrix = mat4.create();
	var z = 0;
	
	this.setPerspective = function(fieldOfViewRadians, aspect, zNear, zFar){
		mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, zNear, zFar);
		var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");
	    // Preparamos una matriz de perspectiva.
	    gl.uniformMatrix4fv(u_proj_matrix, false, projectionMatrix);
	}

	this.setView = function(){

	    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
	    // Preparamos una matriz de modelo+vista.
	    mat4.identity(mvMatrix);
	    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, -10.0 -z*1.0]);
	    mat4.rotate(mvMatrix, mvMatrix, t, [0.0, 1.0, 0.0]);

	    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);                       //Done setting up the buffer
	}
	$('body').on("keydown",function(event){
		if (event.keyCode == 189) z++;	// -
		if (event.keyCode == 187) z--;	// +

    	});

    	$('body').bind('mousewheel DOMMouseScroll', function(event){
	    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
	        z--;	// scroll up
	    }
	    else {
	        z++;	// scroll down
	    }
	});

}



