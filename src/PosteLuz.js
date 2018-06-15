function PosteLuz(_posicion){

    var posteBase = new VertexGrid(5,5);
    var posteLampara = new Esfera(_posicion, 1);

    posteBase.translate(_posicion[0],_posicion[1],_posicion[2]);
    posteBase.scale([0.05,1,0.05]);
    posteBase.rotate(Math.PI/4, [1,0,0]);

    //posteLampara.translate(-6.3,-1.50,0);
    //posteLampara.scale([0.1,0.1,1.2]);
    //posteLampara.rotate(Math.PI/4, [1,0,0]);

    this.initialize = function(){
        posteBase.setColor([0.0,0.0,0.0]);
        posteBase.initialize();

        posteLampara.setColor([1.0,1.0,1.0]);
        posteLampara.initialize();
    }

    this.draw = function(viewMatrix){
        posteBase.draw(viewMatrix);
        posteLampara.draw(viewMatrix);
    }
}