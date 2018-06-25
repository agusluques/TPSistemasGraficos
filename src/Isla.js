function Isla () {

	var Base0,Base1,Base2,Base3;
    var Base0der,Base1der,Base2der,Base3der;

	//Puntos de control para crear las curvas BSpline
	var controlPoints = [];
	var bspline = [];
	var bsplineFinal = [];

	var color_buffer = [];
	var index_buffer = [];
    var texture_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;

    Base0=function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6
    Base1=function(u) { return (4-6*u*u+3*u*u*u)*1/6; }  // (4  -6u2 +3u3)/6
    Base2=function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6
    Base3=function(u) { return (u*u*u)*1/6; }  //    u3/6 
    Base0der=function(u) { return (-3 +6*u -3*u*u)/6 }  // (-3 +6u -3u2)/6
    Base1der=function(u) { return (-12*u+9*u*u)/6 }   // (-12u +9u2)  /6
    Base2der=function(u) { return (3+6*u-9*u*u)/6;}    // (-3 +6u -9u2)/6
    Base3der=function(u) { return (3*u*u)*1/6; }   

    var createControlPoints = function(){

    	controlPoints = [[100, 300, 0], [150, 275, 0], [200, 250, 0], [250, 225, 0], [300, 175, 0], [350, 125, 0], [400, 100, 0], [450, 75, 0], [600, 0, 0], [650, 0, 0], [700, 0, 0] , [900, 0, 0]];

    }

    var cambiarRadio = function(puntoRotado, angulo, anguloAux){

    	var radio = Math.sqrt((puntoRotado.x * puntoRotado.x) + (puntoRotado.z * puntoRotado.z));
    	radio = radio + (30*Math.sin(anguloAux));

		bsplineFinal.push(radio * Math.cos(angulo));
		bsplineFinal.push(puntoRotado.y);
		bsplineFinal.push(radio * Math.sin(angulo));

    }

    var rotarBspline = function(){
        // Rotacion de los puntos
        var puntoRotado = new Object();
        var angulo = 0;
        var anguloAux = 0.0;
        while(angulo < Math.PI*2){

            bsplineFinal.push(0);
            bsplineFinal.push(250);
            bsplineFinal.push(0);
			for (var i = 0; i < bspline.length; i = i +3) {
				
	            puntoRotado.x = ((bspline[i] * Math.cos(angulo)) - (bspline[i+2] * Math.sin(angulo)));
	            puntoRotado.y = bspline[i+1];
	            puntoRotado.z = ((bspline[i] * Math.sin(angulo)) + (bspline[i+2] * Math.cos(angulo)));

	            cambiarRadio(puntoRotado, angulo, anguloAux);

	            //bsplineFinal.push(puntoRotado.x);
	            //bsplineFinal.push(puntoRotado.y);
	            //bsplineFinal.push(puntoRotado.z);
			}
           
            angulo = angulo + Math.PI/72;
            anguloAux = anguloAux + Math.PI/8;
        }
        //console.log("BSPLINE FINAL");
        //console.log(bsplineFinal);
    }

    var calcularPuntosBspline = function(p0, p1, p2, p3){
    	var u = 0;
    	while (u < 1){

			var punto = new Object();
			punto.x = Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
			bspline.push(punto.x);
			punto.y = Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
			bspline.push(punto.y);
			punto.z = Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];
			bspline.push(punto.z);

    		u+=0.25;
    	}

    }

    var createBSplineCurvePoints = function(){

        for (var i = 0; i < 9; i++) {
        	calcularPuntosBspline(controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]);
        }

    }

    var createColorBuffer = function(){

        for (var i = 0; i < 5365; i++) {
			color_buffer.push(0.0);
			color_buffer.push(0.0);
			color_buffer.push(0.0);
       };
        
    }

    var createIndexBuffer = function(){

        index_buffer = [];
        var cols = 37;
        var rows = 145;
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
        //console.log(index_buffer);
    }

    var createTextureBuffer = function(){
        texture_buffer = [];
        var cols = 37;
        var rows = 145;
        for (var i = 0; i < rows; i++) {
            for (var j = 0.0; j < cols; j++){
                texture_buffer.push(1-(i/(rows-1)));
                texture_buffer.push(1-(j/(cols-1)));
            }
        }
    }

    // Esta función crea e incializa los buffers dentro del pipeline para luego
    // utlizarlos a la hora de renderizar.
    var setupWebGLBuffers = function(){
        var min = Math.min.apply(null, bsplineFinal),
            max = Math.max.apply(null, bsplineFinal)
        	bsplineFinal = bsplineFinal.map(function(e) { 
                                          e = ((25*(e - min))/(max - min)) -5
                                          return e;
                                        });

        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bsplineFinal), gl.STATIC_DRAW);

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
        var modelMatrix = mat4.create();
        
        mat4.rotate(modelMatrix, modelMatrix, Math.PI, [1,0,0]);
        mat4.scale(modelMatrix, modelMatrix, [1,1,2]);
        mat4.translate(modelMatrix, modelMatrix, [0, -8, -10]);
        
        return modelMatrix;

    }

    this.initialize = function(){
    	createControlPoints();
    	createBSplineCurvePoints();
    	rotarBspline();
        createColorBuffer();
        createIndexBuffer();
        createTextureBuffer();
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
        gl.bindTexture(gl.TEXTURE_2D, islaTexture);
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