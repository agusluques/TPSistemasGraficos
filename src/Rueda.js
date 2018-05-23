function Rueda(){
	var modelMatrix = mat4.create();
	var cilindro1 = new VertexGrid(20,5);
	var cilindro2 = new VertexGrid(20,5);
	cilindro1.translate(-5,-0.8,3);
	cilindro1.scale([0.005,0.05,0.05]);

	cilindro2.translate(-5.1,-0.8,3);
	cilindro2.scale([0.005,0.05,0.05]);

	this.translate = function(x,y,z){
        mat4.translate(modelMatrix, modelMatrix, [x, y, z]);
    }

    this.rotate = function(alfa, vector){
        mat4.rotate(modelMatrix, modelMatrix, alfa, vector);
    }

    this.scale = function( vector){
        mat4.scale(modelMatrix, modelMatrix, vector);
    }

    this.initialize = function(){
        cilindro1.initialize();
        cilindro2.initialize();
    }

    this.draw = function(viewMatrix){
		cilindro1.draw(viewMatrix);
		cilindro2.draw(viewMatrix);
    }
}