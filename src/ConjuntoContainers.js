function ConjuntoContainers(){

	var cantidadContainers = 15;
	var listaContainers = [];
	var filas = 5;
	var columnas = 3;

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
        var indice = 0;
        for(var i = 0; i < filas; i++){
            for (var j = 0; j < columnas; j++) {
            	listaContainers.push(new Container([-7 + (distanciaX*i), -0.8, 2.2 + (distanciaZ*j)]));
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

    $('body').on("keydown",function(event){
        if (event.keyCode == 75) moverContainer(0);    // k
        if (event.keyCode == 76) moverContainer(1);    // l
        if (event.keyCode == 85) moverContainer(2);    // u
        if (event.keyCode == 74) moverContainer(3);    // j

    });
}