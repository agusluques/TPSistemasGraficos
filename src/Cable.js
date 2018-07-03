function Cable(_posicion){

	var posicion = _posicion;
    var posicionAux;
	var puntosVertice = [];
    var tamanio = [0.0125,1.12,0.0125];

	var color_buffer = [];
	var index_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

    var modelMatrix;

	var crearVertices = function(){
		puntosVertice = [ 0.5,0,0.5, 0,0,0, 0,1,0, 0.5,0,0.5, 1,0,0, 1,1,0, 0.5,0,0.5, 1,0,1, 1,1,1, 0.5,0,0.5, 0,0,1, 0,1,1, 0.5,0,0.5, 0,0,0, 0,1,0 ];
	}

    var createColorBuffer = function(){

        for (var i = 0; i < 15; i++) { 
           color_buffer.push(0);
           color_buffer.push(0);
           color_buffer.push(0);
       };
        
    }

    var createIndexBuffer = function(){

        index_buffer = [];
        var cols = 3;
        var rows = 5;
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

    // Esta función crea e incializa los buffers dentro del pipeline para luego
    // utlizarlos a la hora de renderizar.
    var setupWebGLBuffers = function(){

        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(puntosVertice), gl.STATIC_DRAW);

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
        
        mat4.translate(modelMatrix, modelMatrix, posicion);
        mat4.scale(modelMatrix, modelMatrix, tamanio);
        
        return modelMatrix;

    }

    var trasladarOrigen = function(){
        posicionAux = posicion;
        posicion = [0,0,0];
    }

    var escalarEnOrigen = function(_arg){
        if(_arg == 0){
            //if(tamanio[1]<2){
                tamanio[1] = tamanio[1]+0.1;
            //}
        } else {
            //if(tamanio[1]>0.5){
                tamanio[1] = tamanio[1]-0.1;
            //}
        }
        
    }

    var retornarPosicion = function(){
        posicion = posicionAux;
    }

    this.translate = function(x,y,z){
        posicion[0] += x;
        posicion[1] += y;
        posicion[2] += z;
    }

    this.escalarCable = function(_arg){
        trasladarOrigen();
        escalarEnOrigen(_arg);
        retornarPosicion();
    }

	this.initialize = function(){
		crearVertices();
        createColorBuffer();
        createIndexBuffer();
        setupWebGLBuffers();
	}

    this.draw = function(viewMatrix){
        var modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, getModelMatrix());
        var u_modelview_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
        gl.uniformMatrix4fv(u_modelview_matrix, false, modelViewMatrix);

        var modelMatrix = getModelMatrix();
        var u_model_matrix = gl.getUniformLocation(glProgram, "uMMatrix");
        gl.uniformMatrix4fv(u_model_matrix, false, modelMatrix);

        var materialShininessUniform = gl.getUniformLocation(glProgram, "uMaterialShininess");
        gl.uniform1f(materialShininessUniform, 99999.0);

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
    }

}