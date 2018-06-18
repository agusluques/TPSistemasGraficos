function TapaBarco(_puntosContorno){

	var puntosContorno = _puntosContorno;
	var segundoNivel = [];
	var tercerNivel = [];
	var cuartoNivel = [];
	var quintoNivel = [];

	var position_buffer = [];
	var color_buffer = [];
	var index_buffer = [];
    var texture_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;

	var expandPoints = function(_bufferIN, _bufferOUT){
		var i;
		for (i = 0; i < _bufferIN.length; i = i+3) {
			_bufferOUT.push(_bufferIN[i]*0.5);
			_bufferOUT.push(_bufferIN[i+1]);
			_bufferOUT.push(_bufferIN[i+2]*0.5);
		}
	}

	var crearSegundoNivel = function(){
		expandPoints(puntosContorno, segundoNivel);
	}

	var crearTercerNivel = function(){
		expandPoints(segundoNivel, tercerNivel);
	}

	var crearCuartoNivel = function(){
		expandPoints(tercerNivel, cuartoNivel);
	}

	var crearQuintoNivel = function(){
		var puntoCentral = [-4, -4, 0];
		for (var i = 0; i < puntosContorno.length; i=i+3) {
			quintoNivel.push(puntoCentral[0]);
			quintoNivel.push(puntoCentral[1]);
			quintoNivel.push(puntoCentral[2]);
		}
	}

    var createPoints = function(){
    	crearSegundoNivel();
    	crearTercerNivel();
    	crearCuartoNivel();
    	crearQuintoNivel();
    	console.log("Primer Nivel");
    	console.log(puntosContorno);
		console.log("Segundo Nivel");
		console.log(segundoNivel);
		console.log("Tercer Nivel");
		console.log(tercerNivel);
		console.log("Cuarto Nivel");
		console.log(cuartoNivel);
		console.log("Quinto Nivel");
		console.log(quintoNivel);
    }

    var joinPoints = function(){
    	for (var i = 0; i < puntosContorno.length; i=i+3) {
			
			position_buffer.push(puntosContorno[i]);
			position_buffer.push(puntosContorno[i+1]);
			position_buffer.push(puntosContorno[i+2]);

			position_buffer.push(segundoNivel[i]);
			position_buffer.push(segundoNivel[i+1]);
			position_buffer.push(segundoNivel[i+2]);

			position_buffer.push(tercerNivel[i]);
			position_buffer.push(tercerNivel[i+1]);
			position_buffer.push(tercerNivel[i+2]);

			position_buffer.push(cuartoNivel[i]);
			position_buffer.push(cuartoNivel[i+1]);
			position_buffer.push(cuartoNivel[i+2]);

			position_buffer.push(quintoNivel[i]);
			position_buffer.push(quintoNivel[i+1]);
			position_buffer.push(quintoNivel[i+2]);
    	}
    }

    var createColorBuffer = function(){
        for (var i = 0; i < 225; i++) { //5 niveles de 45 puntos
           color_buffer.push(0.0);
           color_buffer.push(0.0);
           color_buffer.push(0.0);
       };
    }

    var createIndexBuffer = function(){
        index_buffer = [];
        var cols = 5; //Niveles
        var rows = 45; //Puntos por nivel
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
        var cols = 5; //Niveles
        var rows = 45; //Puntos por nivel

        for (var i = 0; i < rows; i++) {
            for (var j = 0.0; j < cols; j++){
                texture_buffer.push((i/rows));
                texture_buffer.push((j/cols));
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);

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

    this.initialize = function(){
    	createPoints();
    	joinPoints();
        createColorBuffer();
        createIndexBuffer();
        createTextureBuffer();
        setupWebGLBuffers();
	}

    var getModelMatrix = function(){
        var modelMatrix = mat4.create();
        mat4.scale(modelMatrix, modelMatrix, [0.125,0.125,0.125]);
        mat4.translate(modelMatrix, modelMatrix, [-60.0, 0, 0]);       
        return modelMatrix;
    }

    this.draw = function(viewMatrix){
        var modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, getModelMatrix());
        var u_modelview_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
        gl.uniformMatrix4fv(u_modelview_matrix, false, modelViewMatrix);

        var modelMatrix = getModelMatrix();
        var u_model_matrix = gl.getUniformLocation(glProgram, "uMMatrix");
        gl.uniformMatrix4fv(u_model_matrix, false, modelMatrix);

        var vertexTextureAttribute = gl.getAttribLocation(glProgram, "aUv");
        gl.enableVertexAttribArray(vertexTextureAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

        var texturaUniform = gl.getUniformLocation(glProgram, "uTextura");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tapaBarcoTexture);
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
        //gl.drawElements(gl.POINTS_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }
}