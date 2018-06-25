function Water () {

    var position_buffer = [];
    var normal_buffer = [];
    var position_render_buffer = [];
    var position_render_buffer_rotado = [];
    var color_buffer = [];
    var index_buffer = [];
    var texture_buffer = [];

    var webgl_position_buffer = null;
    var webgl_normal_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;

    var cantidadPuntosX = 101.0;
    var cantidadPuntosZ = 101.0;

    var createPoints = function(){

        //position_buffer =[ 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1 ];
        //color_buffer = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
        //texture_buffer = [0, 0, 1, 0, 0, 1, 1, 1];

        for (var i = 0.0; i < cantidadPuntosX; i++) {
        	for (var j = 0.0; j < cantidadPuntosZ; j++) {
        		position_buffer.push(i);
        		position_buffer.push(0.0);
        		position_buffer.push(j);

        		normal_buffer.push(0.0);
        		normal_buffer.push(-1.0);
        		normal_buffer.push(0.0);

        		color_buffer.push(0.0);
        		color_buffer.push(0.0);
        		color_buffer.push(0.0);

        		texture_buffer.push(i/(cantidadPuntosX-1));
        		texture_buffer.push(j/(cantidadPuntosZ-1));

        	}
        }

        /*
        console.log("Position Buffer");
        console.log(position_buffer);
        console.log("Color Buffer");
        console.log(color_buffer);
        console.log("Texture Buffer");
        console.log(texture_buffer);*/
    }

    var createIndexBuffer = function(){
        index_buffer = [];
        var cols = 101;
        var rows = 101;
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

        webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW); 


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
        mat4.translate(modelMatrix, modelMatrix, [-40, 0, -40]);

        return modelMatrix;

    }

    this.animate = function(angulo){
        for (var i = 0; i < (cantidadPuntosX * cantidadPuntosZ * 3); i = i+3) {
			//position_buffer[i+1] = position_buffer[i+1] + (Math.sin(angulo)/40);
            //position_buffer[i+1] = position_buffer[i+1] + 20*((Math.sin(position_buffer[i])/40) * (Math.sin(angulo)/40));
   		    position_buffer[i+1] = position_buffer[i+1] + 4000*((Math.sin(position_buffer[i])/40) * (Math.sin(position_buffer[i+2])/40) * (Math.sin(angulo)/40));
        }
        setupWebGLBuffers();
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

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelMatrix);
        var u_normal_matrix = gl.getUniformLocation(glProgram, "uNMatrix");
        gl.uniformMatrix3fv(u_normal_matrix, false, normalMatrix);

        var vertexTextureAttribute = gl.getAttribLocation(glProgram, "aUv");
        gl.enableVertexAttribArray(vertexTextureAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

        var texturaUniform = gl.getUniformLocation(glProgram, "uTextura");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, waterTexture);
        gl.uniform1i(texturaUniform, 0);

        var texturaUniform2 = gl.getUniformLocation(glProgram, "uTextura2");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, waterTexture);
        gl.uniform1i(texturaUniform2, 0);

        var uId = gl.getUniformLocation(glProgram, "uId");
        gl.uniform1i(uId, 1);

        var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_color_buffer);
        gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);

        // Dibujamos.
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }
}