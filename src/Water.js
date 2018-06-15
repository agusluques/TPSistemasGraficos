function Water () {

    var position_buffer;
    var position_render_buffer = [];
    var position_render_buffer_rotado = [];
    var color_buffer, index_buffer, texture_buffer;

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;



    var createPoints = function(){

        position_buffer =[ 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1 ];
        color_buffer = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
        texture_buffer = [0, 0, 1, 0, 0, 1, 1, 1];


    }

    var createIndexBuffer = function(){
        index_buffer = [];
        var cols = 2;
        var rows = 2;
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

    var getModelMatrix = function(){
        var modelMatrix = mat4.create();
        

        mat4.scale(modelMatrix, modelMatrix, [1000,1000,1000]);
        mat4.translate(modelMatrix, modelMatrix, [-0.5, 0, -0.5]);

        return modelMatrix;

    }

    this.initialize = function(){
        createPoints();
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

        var vertexTextureAttribute = gl.getAttribLocation(glProgram, "aUv");
        gl.enableVertexAttribArray(vertexTextureAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

        var texturaUniform = gl.getUniformLocation(glProgram, "uTextura");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, waterTexture);
        gl.uniform1i(texturaUniform, 0);

        var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_color_buffer);
        gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);

        // Dibujamos.
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }
}