function OrbitalCamera(){
	var vMatrix = mat4.create();
	var radio = 15.0;
	var previousClientX = 0, previousClientY = 0, alfa = Math.PI, beta = Math.PI/1.5, factorVelocidad = 0.01;

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

			if (beta<0) beta=0.1;
			if (beta>Math.PI) beta=Math.PI-0.1;
			//console.log("X: " + radio * Math.sin(beta) * Math.cos(-alfa));
			//console.log("Y: " + radio * Math.cos(beta));
			//console.log("Z: " + radio * Math.sin(beta) * Math.sin(-alfa));
		}else{
			previousClientX = mouse.x;
	        previousClientY = mouse.y;
		}


	    // Preparamos una matriz de modelo+vista.
	    mat4.lookAt(vMatrix, [radio * Math.sin(beta) * Math.cos(-alfa), radio * Math.cos(beta), radio * Math.sin(beta) * Math.sin(-alfa)], [0.0,0.0,0.0], [0.0,1.0,0.0]);
	    //mat4.invert(mvMatrix, mvMatrix);
	    return vMatrix;                       //Done setting up the buffer
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