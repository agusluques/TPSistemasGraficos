function Container () {

    var listaContainers = [];
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
    container3.rotate(Math.PI/4, [1,0,0]);

    this.initialize = function(){
        container1.setColor([0.1, 0.5, 0.69]);
        container1.initialize();
        container2.setColor([0.8, 0.76, 0.29]);
        container2.initialize();
        container3.setColor([0.0, 0.56, 0.2]);
        container3.initialize();
    }

    this.draw = function(viewMatrix){
        container1.draw(viewMatrix);
        container2.draw(viewMatrix);
        container3.draw(viewMatrix);
    }

}