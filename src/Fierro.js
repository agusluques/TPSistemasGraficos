function Fierro(_posicion, _diagonal, _tamano){
    var posicion = _posicion;
    var tamano = _tamano;
    var diagonal = _diagonal;

    var posicionRelativa = [-5 + posicion[0],-1.8*tamano[1] + posicion[1], 3.05 + posicion[2]];

	var fierro = new Cubo();


    var setFierro = function(){
        fierro.reset();
        fierro.translate(posicion[0], posicion[1], posicion[2]);
        fierro.translate(-5,-1.8*tamano[1],3.05);
        if (diagonal) fierro.rotate(Math.PI/4, [1,0,0]);
        fierro.scale(tamano);
        //fierro.rotate(Math.PI/4, [1,0,0]);
        // fierro.rotate(Math.PI/2, [1,0,0]);
        // fierro.rotate(Math.PI/2, [0,1,0]);
    }

    this.getPosicion = function(){
        return posicion;
    }

    this.getPosicionRelativa = function(){
        return posicionRelativa;
    }

	this.translate = function(x,y,z){
        posicion[0] += x;
        posicion[1] += y;
        posicion[2] += z;

        posicionRelativa[0] += x;
        posicionRelativa[1] += y;
        posicionRelativa[2] += z;
    }

    this.scale = function(x,y,z){
        tamano[0] += x;
        tamano[1] += y;
        tamano[2] += z;

        posicionRelativa[1] += y; 
    }

    this.initialize = function(){
        fierro.initialize();
    }

    this.draw = function(viewMatrix){
        setFierro();
		fierro.draw(viewMatrix, fierroTexture, 34.0);
    }
}