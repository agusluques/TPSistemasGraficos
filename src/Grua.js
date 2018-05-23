function Grua(){
	var ruedas = [];
	ruedas.push(new Rueda());
	ruedas.push(new Rueda());
	ruedas.push(new Rueda());
	ruedas.push(new Rueda());


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
}