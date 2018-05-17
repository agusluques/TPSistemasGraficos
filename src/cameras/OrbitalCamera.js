function OrbitalCamera(){
	var mvMatrix = mat4.create();
	var radio = 10.0;
	var previousClientX = 0, previousClientY = 0, alfa = 0, beta = Math.PI/2, factorVelocidad = 0.01;

    var isMouseDown = false;
    var actualEvent;

	var mouse = {x: 0, y: 0};
	
	

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

	this.zoomOut = function(){
		radio++;
	}

	this.zoomIn = function(){
		radio--;
	}

	this.setMouse = function(x, y){
		mouse.x = x;
		mouse.y = y;
	}

	this.isMouseDown = function(result){
		isMouseDown = result;
	}
	

}