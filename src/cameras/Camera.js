function Camera(){

	var orbitalCamera = new OrbitalCamera();
	var cabinCamera = new CabinCamera();
	//var firstPersonCamera = new FirstPersonCamera();

	var actualCamera = orbitalCamera;
	var actualCameraAux = 1;


	this.setPerspective = function(fieldOfViewRadians, aspect, zNear, zFar){
		var projectionMatrix = mat4.create();
		
		mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, zNear, zFar);
		var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");

	    // Preparamos una matriz de perspectiva.
	    gl.uniformMatrix4fv(u_proj_matrix, false, projectionMatrix);
	}

	this.setView = function(){
		actualCamera.setView();
	}

	var changeCamera = function(){
		actualCameraAux++;
		if (actualCameraAux > 2) actualCameraAux = 1;

		switch(actualCameraAux){
			case 1:
				actualCamera = orbitalCamera;
				break;
			case 2:
				actualCamera = cabinCamera;
				break;
			case 3:
				//actualCamera = firstPersonCamera;
				break;
		}
	}


	// add event listeners

	$('body').on("keydown",function(event){
		//alert(event.keyCode);
		if (event.keyCode == 67) changeCamera();

		if(actualCameraAux == 1){
			if (event.keyCode == 189) orbitalCamera.zoomOut();	// -
			if (event.keyCode == 187) orbitalCamera.zoomIn();	// +
		}
	});

    $('body').bind('mousewheel DOMMouseScroll', function(event){
    	if (actualCameraAux == 1){
		    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		        orbitalCamera.zoomIn();	// scroll up
		    }
		    else {
		        orbitalCamera.zoomOut();	// scroll down
		    }
		}

	});

	$('body').mousemove(function(e){ 
		actualCamera.setMouse(e.clientX || e.pageX, e.clientY || e.pageY);
	});

	$('body').mousedown(function(event){
		switch (event.which) {
			case 1:	
				actualCamera.isMouseDown(true);
				break;
		}     
	});

	$('body').mouseup(function(event){
		switch (event.which) {
			case 1:	
				actualCamera.isMouseDown(false);
				break;
		}  		
	});
}



