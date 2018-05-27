function CabinCamera(){
	var vMatrix = mat4.create();
	var previousClientX = 0, previousClientY = 0, alfa = 0, beta = 0.0, factorVelocidad = 0.01;

    var isMouseDown = false;
    var actualEvent;

	var mouse = {x: 0, y: 0};

	var posX = -7.9;
	var posY = -3.5;
	var posZ = 0.3;

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
	    mat4.lookAt(vMatrix, [posX,posY,posZ], [alfa, beta, 0], [0.0,1.0,0.0]);

	    return vMatrix;                    //Done setting up the buffer
	}


	this.setMouse = function(x, y){
		mouse.x = x;
		mouse.y = y;
	}

	this.isMouseDown = function(result){
		isMouseDown = result;
	}

    var desplazarCamara = function(sentido){
            if (sentido == 0) posZ = posZ -0.1;
            if (sentido == 1) posZ = posZ +0.1;
            if (sentido == 2) posX = posX +0.1;
            if (sentido == 3) posX = posX -0.1;
    }

    var validarLimiteCabina = function(arg){

    	if(arg == 0){
    		if(posZ>=-0.6){
    			desplazarCamara(0); //arriba
    		}
    	} else if(arg == 1) {
    		if(posZ<=2.8){
    			desplazarCamara(1); //abajo
    		}
    	} else if(arg == 2){
    		if(posX<-6.3){
    			desplazarCamara(2);
    		}
    	} else if(arg == 3){
    		if(posX>-9.5){
    			desplazarCamara(3);
    		}
    	}   
    }
	
    $('body').on("keydown",function(event){
        //alert(event.keyCode)
        if (event.keyCode == 38){
            validarLimiteCabina(0); //Adelante
        } 
        if (event.keyCode == 40){
            validarLimiteCabina(1); //Atras
        } 
        if (event.keyCode == 37){
            validarLimiteCabina(2); //Izquierda
        } 
        if (event.keyCode == 39){
            validarLimiteCabina(3); //Derecha
        }
    });

}