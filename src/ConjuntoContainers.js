function ConjuntoContainers(){

	var listaContainers = [];

	//Configuración inicial de los containers
	var filasMuelle = 5;
	var columnasMuelle = 3;
	var nivelesMuelle = 3;
	var filasBarco = 1;
	var columnasBarco = 5;
	var nivelesBarco = 3;

	//Distancia entre containers
	var distanciaX = -0.6;
	var distanciaY = -0.13;
	var distanciaZ = 0.2;

	var ubicarContainers = function(){
        for (var i = 0; i < listaContainers.length; i++) {
        	listaContainers[i].ubicar();
        	listaContainers[i].colorear();
        }
	}

    this.initialize = function(){
        //Containers en el muelle
        for(var i = 0; i < filasMuelle; i++){
            for (var j = 0; j < columnasMuelle; j++) {
            	listaContainers.push(new Container([-7 + (distanciaX*i), -0.8, 2.2 + (distanciaZ*j)]));
            }
        }

        //Containers en el barco
		for(var i = 0; i < filasBarco; i++){
            for (var j = 0; j < columnasBarco; j++) {
            	for (var k = 0; k < nivelesBarco; k++) {
            		listaContainers.push(new Container([-7 + (distanciaX*i), -0.6 + (distanciaY*k), -0.35 + (distanciaZ*j)]));
            	}
            }
        }


        ubicarContainers();
    }

    this.draw = function(viewMatrix){
        for (var i = 0; i < listaContainers.length; i++) {
        	listaContainers[i].draw(viewMatrix);
        }
    }

    var moverContainer = function(sentido){
        for (var i = 0; i < listaContainers.length; i++) {
        	listaContainers[i].reset();
            if (sentido == 0) listaContainers[i].translate(0.1,0,0);
            if (sentido == 1) listaContainers[i].translate(-0.1,0,0);
            if (sentido == 2) listaContainers[i].translate(0,0.1,0);
            if (sentido == 3) listaContainers[i].translate(0,-0.1,0);
            
        }
    }

    this.getContainerCercano = function(posicion){
        var distancia, distanciaAux, containerActual;
        for (var i = 0; i < listaContainers.length; i++) {
            if (i == 0) {
                distancia = Math.pow(listaContainers[i].getPosicion()[0] - posicion[0], 2);
                distancia += Math.pow(listaContainers[i].getPosicion()[1] - posicion[1], 2);
                distancia += Math.pow(listaContainers[i].getPosicion()[2] - posicion[2], 2);

                containerActual = i;
            }else{
                distanciaAux = Math.pow(listaContainers[i].getPosicion()[0] - posicion[0], 2);
                distanciaAux += Math.pow(listaContainers[i].getPosicion()[1] - posicion[1], 2);
                distanciaAux += Math.pow(listaContainers[i].getPosicion()[2] - posicion[2], 2);

                if (distanciaAux < distancia) {
                    distancia = distanciaAux;
                    containerActual = i;
                }
            }
            
        }
        return listaContainers[containerActual];
    }

    /*
    $('body').on("keydown",function(event){
        if (event.keyCode == 75) moverContainer(0);    // k
        if (event.keyCode == 76) moverContainer(1);    // l
        if (event.keyCode == 85) moverContainer(2);    // u
        if (event.keyCode == 74) moverContainer(3);    // j

    });*/
}