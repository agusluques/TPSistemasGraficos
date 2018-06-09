function puenteMando(){

    var mandoBase = new PuenteMandoInferior();
    var mandoTope = new PuenteMandoSuperior();

    mandoBase.translate(-6.3,-1,0);
    mandoBase.scale([0.1,0.4,0.4]);
    mandoBase.rotate(Math.PI/2, [0,1,0]);
    mandoBase.rotate(Math.PI, [1,0,0]);

    mandoTope.translate(-6.3,-1.50,0);
    mandoTope.scale([0.1,0.1,0.7]);
    mandoTope.rotate(Math.PI/2, [0,1,0]);
    mandoTope.rotate(Math.PI, [1,0,0]);

    this.initialize = function(){
        mandoBase.setColor([0,0,0]);
        mandoBase.initialize();

        mandoTope.setColor([0,0,0]);
        mandoTope.initialize();
    }

    this.draw = function(viewMatrix){
        mandoBase.draw(viewMatrix, puenteMandoTexture);
        mandoTope.draw(viewMatrix, puenteMandoTexture);
    }
}