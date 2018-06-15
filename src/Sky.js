function Sky(){

    var cielo = new Esfera([0.0,0.0,0.0], 200);

    this.initialize = function(){
        cielo.initialize();
    }

    this.draw = function(viewMatrix){
        cielo.setColor([0.0,0.0,0.0]);
        cielo.draw(viewMatrix, skyTexture);
    }
}