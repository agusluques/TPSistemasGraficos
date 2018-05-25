function puenteMando(){

    var mandoBase = new VertexGrid(5,5);
    var mandoTope = new VertexGrid(5,5);

    mandoBase.translate(-6.3,-1,0);
    mandoBase.scale([0.1,0.6,0.9]);
    mandoBase.rotate(Math.PI/4, [1,0,0]);

    mandoTope.translate(-6.3,-1.50,0);
    mandoTope.scale([0.1,0.1,1.2]);
    mandoTope.rotate(Math.PI/4, [1,0,0]);

    this.initialize = function(){
        mandoBase.setColor([0,0,0]);
        mandoBase.initialize();

        mandoTope.setColor([0,0,0]);
        mandoTope.initialize();
    }

    this.draw = function(viewMatrix){
        mandoBase.draw(viewMatrix);
        mandoTope.draw(viewMatrix);
    }
}