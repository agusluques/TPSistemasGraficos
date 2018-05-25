function Grua(){
	var ruedas = [];
	ruedas.push(new Rueda([-2,0,-1]));
	ruedas.push(new Rueda([-4,0,-1]));
	ruedas.push(new Rueda([-2,0,0]));
	ruedas.push(new Rueda([-4,0,0]));


    this.initialize = function(){
        for (var i = 0; i < ruedas.length; i++) {
        	ruedas[i].initialize();
        }
        
    }

    this.draw = function(viewMatrix){
        for (var i = 0; i < ruedas.length; i++) {
        	ruedas[i].draw(viewMatrix);
        }
    }

    var moverRuedas = function(sentido){
        for (var i = 0; i < ruedas.length; i++) {
            ruedas[i].rotate();
            if (sentido == 1) ruedas[i].translate(-0.1,0,0);
            if (sentido == 0) ruedas[i].translate(0.1,0,0);
            
        }
    }

    $('body').on("keydown",function(event){
        if (event.keyCode == 37) moverRuedas(0);    // izq
        if (event.keyCode == 39) moverRuedas(1);    // der

    });
}