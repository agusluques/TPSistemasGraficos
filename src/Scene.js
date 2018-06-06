function Scene(){
    var objetos = [];
    objetos.push(new Water());
    objetos.push(new Barco());
    var grua = new Grua();
    objetos.push(grua);
    objetos.push(new Muelle());
    var conjuntoContainers = new ConjuntoContainers();
    objetos.push(conjuntoContainers);
    objetos.push(new puenteMando());
    objetos.push(new Isla());

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

    var tomarContainer = function(accion){
        if(!grua.hasContainer()){
            var posicion = grua.getPosicionImanes();
            var container = conjuntoContainers.getContainerCercano(posicion);
            grua.tomarContainer(container);
        }else{
            // TODO: implementar el soltado
        }
    }

    $('body').on("keydown",function(event){
        if (event.keyCode == 69) tomarContainer(1);    // e


    });
}