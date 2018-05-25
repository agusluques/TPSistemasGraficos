function Container () {

    //Definir la cantidad de containers de la escena
    var cantidadContainersMuelle = 18;
    var cantidadContainersBarco = 0;
    var cantidadContainersTotal = cantidadContainersMuelle + cantidadContainersBarco;
    var listaContainers = [];

    var inicializarContainers = function(){

        for(var i = 0; i < cantidadContainersTotal; i++){
            var container = new VertexGrid(5,5);
            listaContainers.push(container);
        }
    }

    var ubicarContainers = function(){
        var distanciaX = -0.6;
        var distanciaY = -0.13;
        var distanciaZ = 0.2;

        //Containers en el muelle
        var filas = 5;
        var columnas = 3;

        var indice = 0;
        for(var i = 0; i < filas; i++){
            for (var j = 0; j < columnas; j++) {
                listaContainers[indice].translate(-7 + (distanciaX*i),-0.8,2.2 + (distanciaZ*j));
                listaContainers[indice].scale([3/16,3/32,3/32])
                listaContainers[indice].rotate(Math.PI/4, [1,0,0]);
                indice = indice + 1;
            }
        }

        listaContainers[indice].translate(-7,-0.8 + distanciaY,2.2);
        listaContainers[indice].scale([3/16,3/32,3/32])
        listaContainers[indice].rotate(Math.PI/4, [1,0,0]);
        indice = indice + 1;

        listaContainers[indice].translate(-7,-0.8 + (2*distanciaY),2.2);
        listaContainers[indice].scale([3/16,3/32,3/32])
        listaContainers[indice].rotate(Math.PI/4, [1,0,0]);
        indice = indice + 1;

        listaContainers[indice].translate(-7 + distanciaX,-0.8 + distanciaY,2.2 + distanciaZ);
        listaContainers[indice].scale([3/16,3/32,3/32])
        listaContainers[indice].rotate(Math.PI/4, [1,0,0]);
        indice = indice + 1;
    }

    var colorearContainers = function(){
        for(var i = 0; i < cantidadContainersTotal; i++){
            listaContainers[i].setColor([Math.random(), Math.random(),Math.random()]);
            listaContainers[i].initialize();
        }
    }

    this.initialize = function(){
        inicializarContainers();
        ubicarContainers();
        colorearContainers();
    }

    this.draw = function(viewMatrix){
        for(var i = 0; i < cantidadContainersTotal; i++){
            listaContainers[i].draw(viewMatrix);
        }
    }

}