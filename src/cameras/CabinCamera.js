function CabinCamera(){
	var vMatrix = mat4.create();
	var previousClientX = 0, previousClientY = 0, alfa = 0, beta = 0.0, factorVelocidad = 0.01;

    var isMouseDown = false;
    var actualEvent;

	var mouse = {x: 0, y: 0};
	
	

	this.getViewMatrix = function(){

		if(isMouseDown){
			var deltaX = mouse.x - previousClientX;
	        var deltaY = mouse.y - previousClientY;

	        previousClientX = mouse.x;
	        previousClientY = mouse.y;

	        alfa = alfa + deltaX * factorVelocidad;
	        beta = beta + deltaY * factorVelocidad;

		}else{
			previousClientX = mouse.x;
	        previousClientY = mouse.y;
		}

	    // Preparamos una matriz de modelo+vista.
	    mat4.lookAt(vMatrix, [0.0,-10.0,0.0], [alfa, beta, 0], [0.0,1.0,0.0]);

	    return vMatrix;                    //Done setting up the buffer
	}


	this.setMouse = function(x, y){
		mouse.x = x;
		mouse.y = y;
	}

	this.isMouseDown = function(result){
		isMouseDown = result;
	}
	

}