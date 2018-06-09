function PuenteMandoSuperior () {
    var index_buffer = null;

    var position_buffer = null;
    var color_buffer = null;
    var color = [0.0,0.0,0.0];
    var texture_buffer = null;

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;
    

    var modelMatrix = mat4.create();



    var createIndexBuffer = function(){
        index_buffer = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ];
    }


    var createPuenteMandoSuperior = function(){

        position_buffer = [];
        color_buffer = [];
        texture_buffer = [];
        position_buffer = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        for (var i = 0; i < position_buffer.length; i++){
            color_buffer.push(0.0);
        }
        texture_buffer = [
            // Front face
            0.0, 0.9,
            1.0, 0.9,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            // Top face
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            // Bottom face
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            // Right face
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            // Left face
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0
        ];




        
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

        webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_buffer), gl.STATIC_DRAW); 

        
    }

    var getModelMatrix = function(){
        return modelMatrix;
    }

    this.translate = function(x,y,z){
        mat4.translate(modelMatrix, modelMatrix, [x, y, z]);
    }

    this.rotate = function(alfa, vector){
        mat4.rotate(modelMatrix, modelMatrix, alfa, vector);
    }

    this.scale = function( vector){
        mat4.scale(modelMatrix, modelMatrix, vector);
    }

    this.setColor = function(vector){
        color = vector;
    }

    this.reset = function(){
        modelMatrix = mat4.create();
    }

    this.initialize = function(){
        createPuenteMandoSuperior();
        createIndexBuffer();
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
    }

    
}