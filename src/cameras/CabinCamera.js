function CabinCamera(){
    var actualCameraAux = 1;
    var vMatrix = mat4.create();
    var radio = 0.0;
    var previousClientX = 0, previousClientY = 0, focoX = -8, focoY = 10, focoZ = -5 , factorVelocidad = 0.08;
    var despX = 0, despZ = 0;
    var focoXR, focoYR, focoZR;
    var angulo = Math.PI/16;

    var dirX, dirZ;

    var isMouseDown = false;
    var actualEvent;

    var mouse = {x: 0, y: 0};
    var deltaX = 0, deltaY = 0;

    var posX = -8;
    var posY = -3.5;
    var posZ = 0.3;

    var desplazarFocoOrigen = function(){
        despX = -posX;
        despY = -posY;
        despZ = -posZ;

        focoX = focoX + despX;
        focoY = focoY + despY;
        focoZ = focoZ + despZ;
    }

    var rotarFocoHorizontalmente = function(angulo){
        focoXR = (focoX * Math.cos(angulo)) + (focoZ * Math.sin(angulo));
        focoYR = focoY;
        focoZR = (focoX * -Math.sin(angulo)) + (focoZ * Math.cos(angulo));
    }

    var volverFoco =function(){
        focoX = focoXR - despX;
        focoY = focoYR - despY;
        focoZ = focoZR - despZ;
    }   

    this.getViewMatrix = function(){

        if(isMouseDown){
            deltaX = mouse.x - previousClientX;
            deltaY = mouse.y - previousClientY;

            previousClientX = mouse.x;
            previousClientY = mouse.y;

            //focoX = focoX + deltaX * factorVelocidad;
            focoY = focoY + deltaY * factorVelocidad;

        }else{
            previousClientX = mouse.x;
            previousClientY = mouse.y;
            deltaX = 0;
        }

        rotarCamaraHorizontalmente(angulo * deltaX * -0.01);

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

    var rotarCamaraHorizontalmente = function(angulo){
        desplazarFocoOrigen();
        if(focoX > 10){
        	console.log(focoX);
        } else {
        	rotarFocoHorizontalmente(angulo);
        }
        volverFoco();
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
        if(actualCameraAux != 3){
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
        }
        if (event.keyCode == 67) {                      // C
            actualCameraAux++;
            if (actualCameraAux > 3) actualCameraAux = 1; 
        }     
    });
}