function Grua(){
	var ruedas = [];
	ruedas.push(new Rueda([-2,0,-1]));
	ruedas.push(new Rueda([-4,0,-1]));
	ruedas.push(new Rueda([-2,0,0]));
	ruedas.push(new Rueda([-4,0,0]));

    var fierros = [];
    // columnas
    fierros.push(new Fierro([-2,1.4,-1], 0, [0.05,2,0.06]));
    fierros.push(new Fierro([-4,1.4,-1], 0, [0.05,2,0.06]));
    fierros.push(new Fierro([-2,1.4,0], 0, [0.05,2,0.06]));
    fierros.push(new Fierro([-4,1.4,0], 0, [0.05,2,0.06]));

    // horizontales
    fierros.push(new Fierro([-4,-2.5,-0.5], 0, [0.05,0.05,0.7]));
    fierros.push(new Fierro([-2,-2.5,-0.5], 0, [0.05,0.05,0.7]));
    fierros.push(new Fierro([-4,-3.5,-0.5], 0, [0.05,0.05,0.7]));
    fierros.push(new Fierro([-2,-3.5,-0.5], 0, [0.05,0.05,0.7]));

    // diagonales
    fierros.push(new Fierro([-4,-3,-0.5], 1, [0.05,0.05,1]));
    fierros.push(new Fierro([-2,-3,-0.5], 1, [0.05,0.05,1]));

    // en x
    fierros.push(new Fierro([-3,-3.5,-1], 0, [1,0.05,0.05]));
    fierros.push(new Fierro([-3,-3.5,0], 0, [1,0.05,0.05]));

    // riel superior
    fierros.push(new Fierro([-3.5,-3.5,-2], 0, [0.05,0.1,3]));
    fierros.push(new Fierro([-2.5,-3.5,-2], 0, [0.05,0.1,3]));
    fierros.push(new Fierro([-3,-3.5,-4.08], 0, [0.5,0.1,0.05]));

    // sosten rectangulo grande
    fierros.push(new Fierro([-3,-3.25,0.45], 0, [1,0.25,0.5]));

    var objetosCabina = [];
    // cabina
    objetosCabina.push(new Fierro([-3,-3,-3], 0, [0.5,0.25,0.25]));

    // cables
    objetosCabina.push(new Fierro([-2.9,-1,-2.95], 0, [0.005,1,0.005]));
    objetosCabina.push(new Fierro([-3.1,-1,-2.95], 0, [0.005,1,0.005]));
    objetosCabina.push(new Fierro([-2.9,-1,-3.05], 0, [0.005,1,0.005]));
    objetosCabina.push(new Fierro([-3.1,-1,-3.05], 0, [0.005,1,0.005]));

    // imanes
    objetosCabina.push(new Fierro([-2.9,-2,-3], 0, [0.005,0.05,0.1]));
    objetosCabina.push(new Fierro([-3.1,-2,-3], 0, [0.005,0.05,0.1]));


    this.initialize = function(){
        for (var i = 0; i < ruedas.length; i++) {
        	ruedas[i].initialize();
        }
        for (var i = 0; i < fierros.length; i++) {
            fierros[i].initialize();
        }
        for (var i = 0; i < objetosCabina.length; i++) {
            objetosCabina[i].initialize();
        }
        
    }

    this.draw = function(viewMatrix){
        for (var i = 0; i < ruedas.length; i++) {
        	ruedas[i].draw(viewMatrix);
        }
        for (var i = 0; i < fierros.length; i++) {
            fierros[i].draw(viewMatrix);
        }
        for (var i = 0; i < objetosCabina.length; i++) {
            objetosCabina[i].draw(viewMatrix);
        }
    }

    var desplazarGrua = function(sentido){
        for (var i = 0; i < ruedas.length; i++) {
            ruedas[i].rotate();
            if (sentido == 1) ruedas[i].translate(-0.1,0,0);
            if (sentido == 0) ruedas[i].translate(0.1,0,0);
            
        }
        for (var i = 0; i < fierros.length; i++) {
            if (sentido == 1) fierros[i].translate(-0.1,0,0);
            if (sentido == 0) fierros[i].translate(0.1,0,0);
            
        }
        for (var i = 0; i < objetosCabina.length; i++) {
            if (sentido == 1) objetosCabina[i].translate(-0.1,0,0);
            if (sentido == 0) objetosCabina[i].translate(0.1,0,0);
            
        }
    }

    var desplazarCabina = function(sentido){
        for (var i = 0; i < objetosCabina.length; i++) {
            if (sentido == 1) objetosCabina[i].translate(0,0,-0.1);
            if (sentido == 0) objetosCabina[i].translate(0,0,0.1);
            
        }
    }

    var desplazarCables = function(sentido){
        for (var i = 1; i < 5; i++) {
            // cables
            if (sentido == 1) {
                objetosCabina[i].translate(0,-0.2,0);
                objetosCabina[i].scale(0,-0.1,0);
            }
            if (sentido == 0) {
                objetosCabina[i].translate(0,0.2,0);
                objetosCabina[i].scale(0,0.1,0);
            }
            
        }
        for (var i = 5; i < 7; i++) {
            // imanes
            if (sentido == 1) {
                objetosCabina[i].translate(0,-0.1,0);
            }
            if (sentido == 0) {
                objetosCabina[i].translate(0,0.1,0);
            }
            
        }
    }

    $('body').on("keydown",function(event){
        //alert(event.keyCode)
        if (event.keyCode == 37) desplazarGrua(0);    // izq
        if (event.keyCode == 39) desplazarGrua(1);    // der
        if (event.keyCode == 38) desplazarCabina(1);    // arriba
        if (event.keyCode == 40) desplazarCabina(0);    // abajo
        if (event.keyCode == 81) desplazarCables(1);    // q
        if (event.keyCode == 65) desplazarCables(0);    // a


    });
}