function VertexGrid (_rows, _cols) {
    var cols = _cols;
    var rows = _rows;
    var index_buffer = null;

    var position_buffer = null;
    var color_buffer = null;
    var color = [0.0,0.0,0.0];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

    var modelMatrix = mat4.create();



    var createIndexBuffer = function(){

        index_buffer = [];
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


    var createCilinder = function(){

        position_buffer = [];
        color_buffer = [];
        var delta = (2*Math.PI) / (rows - 1);
        var ang = delta;
        var auxTapas;
        for (var i = 0.0; i < rows; i++) { 
           for (var j = 0.0; j < cols; j++) {

                if (j == 0.0){
                    auxTapas = j + 1;
                    position_buffer.push(auxTapas - (cols-1.0)/2.0);
                    position_buffer.push(0);
                    position_buffer.push(0);
                } else if (j == cols - 1){
                    auxTapas = j - 1;
                    position_buffer.push(auxTapas - (cols-1.0)/2.0);
                    position_buffer.push(0);
                    position_buffer.push(0);  
                } else{
                 
                    position_buffer.push(j - (cols-1.0)/2.0);
                    position_buffer.push(Math.cos(ang));
                    position_buffer.push(Math.sin(ang));
                }
                // Para cada vértice definimos su color
                color_buffer.push(color[0]);
                color_buffer.push(color[1]);
                color_buffer.push(color[2]);
                
                
                
                                  
           };
           ang = ang + delta; 
        };
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
        createCilinder();
        createIndexBuffer();
        setupWebGLBuffers();
    }

    this.draw = function(viewMatrix){
        var modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, getModelMatrix());
        var u_modelview_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
        gl.uniformMatrix4fv(u_modelview_matrix, false, modelViewMatrix);

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