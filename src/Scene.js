function Scene(){
    var objetos = [];
    objetos.push(new Isla());
    objetos.push(new PosteLuz([-6,-1,2.5]));
    objetos.push(new PosteLuz([-10,-1,2.5]));
    objetos.push(new Sky());
    objetos.push(new Barco());
    var grua = new Grua();
    objetos.push(grua);
    objetos.push(new Muelle());
    var conjuntoContainers = new ConjuntoContainers();
    objetos.push(conjuntoContainers);
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

    var tomarContainer = function(accion){
        if(!grua.hasContainer()){
            var posicion = grua.getPosicionImanes();
            var container = conjuntoContainers.getContainerCercano(posicion);
            grua.tomarContainer(container);
        }else{
            container = null;
            grua.soltarContainer();
        }
    }

    $('body').on("keydown",function(event){
        if (event.keyCode == 69) tomarContainer(1);    // e


    });
}