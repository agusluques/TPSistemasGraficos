function Esfera(_posicion){

	var puntosSemicirculo = [];
	var puntosEsfera = [];

	var color_buffer = [];
	var index_buffer = [];
    var texture_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;

    var modelMatrix;

    var rotarSemicircunferencia = function(){
    	
    	//Para cada punto de la semicinfunferencia lo debo rotar 360° para obtener la esfera
    	for (var i = 0; i < puntosSemicirculo.length; i = i+3) {
    		//Rotar sobre el eje X
    		var angulo = 0;
    		while(angulo <= (2*Math.PI)){	
	    		puntosEsfera.push(puntosSemicirculo[i]);
	    		puntosEsfera.push(((puntosSemicirculo[i+1] * Math.cos(angulo)) - (puntosSemicirculo[i+2] * Math.sin(angulo))));
    			puntosEsfera.push(((puntosSemicirculo[i+1] * Math.sin(angulo)) + (puntosSemicirculo[i+2] * Math.cos(angulo))));
	    		angulo = angulo + (2*Math.PI/36);  
    		}  		
    	}
    	//console.log(puntosEsfera);
    }

    var crearVerticesSemicircunferencia = function(){
    	var punto = [1,0,0];
		var angulo = 0;

    	//Roto en Z 90° para obtener una semicircunferencia
    	while(angulo <= Math.PI){
    		puntosSemicirculo.push(((punto[0] * Math.cos(angulo)) - (punto[1] * Math.sin(angulo))));
    		puntosSemicirculo.push(((punto[0] * Math.sin(angulo)) + (punto[1] * Math.cos(angulo))));
    		puntosSemicirculo.push(punto[2]);
    		angulo = angulo + (2*Math.PI/36);
    	}
    	//console.log(puntosSemicirculo);
    }

    var createColorBuffer = function(){

        for (var i = 0; i < 703; i++) { 
           color_buffer.push(1);
           color_buffer.push(1);
           color_buffer.push(1);
       };
        
    }

    var createIndexBuffer = function(){

        index_buffer = [];
        var cols = 37; //Puntos por nivel
        var rows = 19; //Niveles
        var offset = cols-1;
        for (var i = 0; i < rows-1; i++) {
            for (var j = 0.0; j < cols; j++){
                
                if (i % 2 == 0){
                    index_buffer.push(j+(i*cols));
                    index_buffer.push(j+((i+1)*cols));
                } else {
                    index_buffer.push((offset-j)+(i*cols));
                    index_buffer.push((offset-j)+((i+1)*cols));
                }
            }
        }
    }

    var createTextureBuffer = function(){
        texture_buffer = [];
        var cols = 37; //Puntos por nivel
        var rows = 19; //Niveles

        for (var i = 0; i < rows; i++) {
            for (var j = 0.0; j < cols; j++){
                texture_buffer.push(i/rows);
                texture_buffer.push(j/cols);
            }
        }

    }

    // Esta función crea e incializa los buffers dentro del pipeline para luego
    // utlizarlos a la hora de renderizar.
    var setupWebGLBuffers = function(){
        webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_buffer), gl.STATIC_DRAW); 

        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(puntosEsfera), gl.STATIC_DRAW);

        // Repetimos los pasos 1. 2. y 3. para la información del color
        webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);   

        // Repetimos los pasos 1. 2. y 3. para la información de los índices
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar también que se usa un array de enteros en lugar de floats.
        webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
    }

    var getModelMatrix = function(){
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [_posicion[0],_posicion[1]-0.6,_posicion[2]]);
        mat4.scale(modelMatrix, modelMatrix, [0.2,0.2,0.2]);
        
        return modelMatrix;

    }

	this.initialize = function(){
		crearVerticesSemicircunferencia();
		rotarSemicircunferencia();
        createColorBuffer();
        createIndexBuffer();
        createTextureBuffer();
        setupWebGLBuffers();
	}

    this.draw = function(viewMatrix, textura){
        var modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, getModelMatrix());
        var u_modelview_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
        gl.uniformMatrix4fv(u_modelview_matrix, false, modelViewMatrix);

        var vertexTextureAttribute = gl.getAttribLocation(glProgram, "aUv");
        gl.enableVertexAttribArray(vertexTextureAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

        var texturaUniform = gl.getUniformLocation(glProgram, "uTextura");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textura);
        gl.uniform1i(texturaUniform, 0);

        var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_color_buffer);
        gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);

        // Dibujamos.
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
        //gl.drawElements(gl.POINTS_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }

}