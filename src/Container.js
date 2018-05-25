function Container () {

    //Definir la cantidad de containers de la escena
    var cantidadContainers = 3;
    var listaContainers = [];

    /*

    var container1 = new VertexGrid(5,5);
    var container2 = new VertexGrid(5,5);
    var container3 = new VertexGrid(5,5);

    container1.translate(-10,-0.9,3);
    container2.translate(-10,-1.25,3);
    container3.translate(-10,-1.60,3);
    container1.scale([0.5,0.25,0.25])
    container2.scale([0.5,0.25,0.25])
    container3.scale([0.5,0.25,0.25])
    container1.rotate(Math.PI/4, [1,0,0]);
    container2.rotate(Math.PI/4, [1,0,0]);
    container3.rotate(Math.PI/4, [1,0,0]);*/

    var inicializarContainers = function(){

        for(var i = 0; i < cantidadContainers; i++){
            var container = new VertexGrid(5,5);
            listaContainers.push(container);
        }
    }

    var ubicarContainers = function(){
        listaContainers[0].translate(-10,-0.9,3);
        listaContainers[1].translate(-10,-1.25,3);
        listaContainers[2].translate(-10,-1.60,3);
        listaContainers[0].scale([0.5,0.25,0.25])
        listaContainers[1].scale([0.5,0.25,0.25])
        listaContainers[2].scale([0.5,0.25,0.25])
        listaContainers[0].rotate(Math.PI/4, [1,0,0]);
        listaContainers[1].rotate(Math.PI/4, [1,0,0]);
        listaContainers[2].rotate(Math.PI/4, [1,0,0]);
    }

    var colorearContainers = function(){
        for(var i = 0; i < cantidadContainers; i++){
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
        for(var i = 0; i < cantidadContainers; i++){
            listaContainers[i].draw(viewMatrix);
        }
    }

}