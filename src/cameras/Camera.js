function Camera(){
	//var aspect = gl.viewportWidth / gl.viewportHeight;
	//var zNear = 1;
	//var zFar = 2000;
	var projectionMatrix = mat4.create();
	var mvMatrix = mat4.create();
	var radio = 5.0;
	var previousClientX = 0, previousClientY = 0, alfa = 0, beta = Math.PI/2, factorVelocidad = 0.01;

    var isMouseDown = false;
    var actualEvent;

	var mouse = {x: 0, y: 0};
	
	this.setPerspective = function(fieldOfViewRadians, aspect, zNear, zFar){
		mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, zNear, zFar);
		var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");
	    // Preparamos una matriz de perspectiva.
	    gl.uniformMatrix4fv(u_proj_matrix, false, projectionMatrix);
	}

	this.setView = function(){

		if(isMouseDown){
			var deltaX = mouse.x - previousClientX;
	        var deltaY = mouse.y - previousClientY;

	        previousClientX = mouse.x;
	        previousClientY = mouse.y;

	        alfa = alfa + deltaX * factorVelocidad;
	        beta = beta + deltaY * factorVelocidad;

			if (beta<0) beta=0.1;
			if (beta>Math.PI) beta=Math.PI-0.1;
		}else{
			previousClientX = mouse.x;
	        previousClientY = mouse.y;
		}

	    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
	    // Preparamos una matriz de modelo+vista.
	    mat4.lookAt(mvMatrix, [radio * Math.sin(beta) * Math.cos(-alfa), radio * Math.cos(beta), radio * Math.sin(beta) * Math.sin(-alfa)], [0.0,0.0,0.0], [0.0,1.0,0.0]);

	    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);                       //Done setting up the buffer
	}
	$('body').on("keydown",function(event){
		//alert(event.keyCode);
		if (event.keyCode == 189) radio++;	// -
		if (event.keyCode == 187) radio--;	// +

    	});

    	$('body').bind('mousewheel DOMMouseScroll', function(event){
	    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
	        radio++;	// scroll up
	    }
	    else {
	        radio--;	// scroll down
	    }

	});
	$('body').mousemove(function(e){ 
		mouse.x = e.clientX || e.pageX; 
		mouse.y = e.clientY || e.pageY 
	});

	$('body').mousedown(function(event){		
		isMouseDown = true;        
	});

	$('body').mouseup(function(event){
		isMouseDown = false;		
	});

}



