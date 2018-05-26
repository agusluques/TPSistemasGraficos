function Fierro(_posicion, _diagonal, _tamano){
    var posicion = _posicion;
    var tamano = _tamano;
    var diagonal = _diagonal;

	var fierro = new VertexGrid(5,5);


    var setFierro = function(){
        fierro.reset();
        fierro.translate(posicion[0], posicion[1], posicion[2]);
        fierro.translate(-5,-1.8*tamano[1],3.05);
        if (diagonal) fierro.rotate(Math.PI/4, [1,0,0]);
        fierro.scale(tamano);
        fierro.rotate(Math.PI/4, [1,0,0]);
    }

    this.getPosicion = function(){
        return posicion;
    }

	this.translate = function(x,y,z){
        posicion[0] += x;
        posicion[1] += y;
        posicion[2] += z;
    }

    this.scale = function(x,y,z){
        tamano[0] += x;
        tamano[1] += y;
        tamano[2] += z;
    }

    this.initialize = function(){
        fierro.initialize();
    }

    this.draw = function(viewMatrix){
        setFierro();
		fierro.draw(viewMatrix);
    }
}