function Rueda(_posicion){
    var posicion = _posicion;
    var angulo = 0;

	var cilindro1 = new VertexGrid(20,5);
	var cilindro2 = new VertexGrid(20,5);

    var setCilindros = function(){
        cilindro1.reset();
        cilindro1.translate(posicion[0], posicion[1], posicion[2]);
        cilindro1.translate(-5,-0.8,3.1);
        cilindro1.scale([0.1,0.1,0.005]);
        cilindro1.rotate(Math.PI/2, [0,1,0]);

        cilindro2.reset();
        cilindro2.translate(posicion[0], posicion[1], posicion[2]);
        cilindro2.translate(-5,-0.8,3);
        cilindro2.scale([0.1,0.1,0.005]);
        cilindro2.rotate(Math.PI/2, [0,1,0]);
    }

	this.translate = function(x,y,z){
        posicion[0] += x;
        posicion[1] += y;
        posicion[2] += z;
    }

    this.rotate = function(){
        angulo++;
    }

    this.initialize = function(){
        cilindro1.initialize();
        cilindro2.initialize();
    }

    this.draw = function(viewMatrix){
        setCilindros();
		cilindro1.draw(viewMatrix);
		cilindro2.draw(viewMatrix);
    }
}