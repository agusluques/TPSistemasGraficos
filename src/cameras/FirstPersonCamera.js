function FirstPersonCamera(){
	var vMatrix = mat4.create();
	var radio = 0.0;
	var previousClientX = 0, previousClientY = 0, focoX = 0, focoY = 0, focoZ = 3 , factorVelocidad = 0.01;
	var despX = 0, despZ = 0;
	var focoXR, focoZR;
	var angulo = Math.PI/16;

	var dirX, dirZ;

    var isMouseDown = false;
    var actualEvent;

	var mouse = {x: 0, y: 0};

	var posX = -8;
	var posY = -1;
	var posZ = 3;

	var desplazarFocoOrigen = function(){
		despX = -posX;
		despZ = -posZ;

		focoX = focoX + despX;
		focoZ = focoZ + despZ;
	}

	var rotarFoco = function(angulo){
		focoXR = (focoX * Math.cos(angulo)) + (focoZ * Math.sin(angulo));
		focoZR = (focoX * -Math.sin(angulo)) + (focoZ * Math.cos(angulo));
	}

	var volverFoco =function(){
		focoX = focoXR - despX;
		focoZ = focoZR - despZ;
	}	

	this.getViewMatrix = function(){

		if(isMouseDown){
			var deltaX = mouse.x - previousClientX;
	        var deltaY = mouse.y - previousClientY;

	        previousClientX = mouse.x;
	        previousClientY = mouse.y;

        	focoX = focoX + deltaX * factorVelocidad;
	        focoY = focoY + deltaY * factorVelocidad;
	        //focoZ = focoZ + deltaX * factorVelocidad;

		}else{
			previousClientX = mouse.x;
	        previousClientY = mouse.y;
		}

	    // Preparamos una matriz de modelo+vista.
	    mat4.lookAt(vMatrix, [posX,posY,posZ], [focoX, focoY, focoZ], [0.0,1.0,0.0]);
	    return vMatrix;                      //Done setting up the buffer
	}


	this.setMouse = function(x, y){
		mouse.x = x;
		mouse.y = y;
	}

	this.isMouseDown = function(result){
		isMouseDown = result;
	}

	var obtenerVectorDirector = function(){

		dirX = focoX - posX;
		dirZ = focoZ - posZ;

	}

    var desplazar = function(sentido){
		//Flecha arriba
		obtenerVectorDirector();
        if (sentido == 0){
        	posX = posX + dirX * 0.01;
        	posZ = posZ + dirZ * 0.01;
        } 

        //Flecha abajo
        if (sentido == 1){
        	posX = posX - dirX * 0.01;
        	posZ = posZ - dirZ * 0.01;
        } 
    }

    var rotarCamara = function(angulo){
    	desplazarFocoOrigen();
    	rotarFoco(angulo);
    	volverFoco();
    }

    var validarLimiteMuelle = function(arg){
		console.log("focoX: " + focoX + " - focoY: " + focoY + " - focoZ: " + focoZ);
		console.log("PosX: " + posX + " - PosY: " + posY + " - PosZ: " + posZ);
    	if(arg == 0){
			desplazar(0); //arriba
    	} else if(arg == 1) {
			desplazar(1); //abajo
    	}
    }

    $('body').on("keydown",function(event){
        //alert(event.keyCode)
        if (event.keyCode == 38){
            validarLimiteMuelle(0); //Adelante
        } 
        if (event.keyCode == 40){
            validarLimiteMuelle(1); //Atras
        }
   		if (event.keyCode == 79){
   			rotarCamara(-angulo);
        }
   		if (event.keyCode == 80){
            rotarCamara(angulo);
        }
    });
}