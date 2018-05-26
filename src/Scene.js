function Scene(){
    var objetos = [];
    objetos.push(new Water());
    //objetos.push(new VertexGrid(20,5));
    //objetos.push(new Point());
    objetos.push(new Curva('bspline3'));
    objetos.push(new Barco());
    objetos.push(new Grua());
    objetos.push(new Muelle());
    objetos.push(new ConjuntoContainers());
    objetos.push(new puenteMando());

    this.initialize = function(){
		for (var i = 0; i < objetos.length; i++) {
			objetos[i].initialize();
		}
    }

    this.draw = function(viewMatrix){
    	for (var i = 0; i < objetos.length; i++) {
			
			objetos[i].draw(viewMatrix);

	        
		}
    	
    }
}