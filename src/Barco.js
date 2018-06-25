function Barco () {

	var Base0,Base1,Base2,Base3;
	var Base0der,Base1der,Base2der,Base3der;

    var tapa;

	//Puntos de control para crear las curvas de Bezier
	//Se utilizarán 4 curvas de Bezier
	var control_points_1 = [];
	var control_points_2 = [];
	var control_points_3 = [];
	var control_points_4 = [];

	//Puntos de las curvas de Bezier intermedias obtenidos de los puntos de control
	var bezier_points_1 = [];
	var bezier_points_2 = [];
	var bezier_points_3 = [];
	var bezier_points_4 = [];

	var bezier_points_1_d = [];
	var bezier_points_2_d = [];
	var bezier_points_3_d = [];
	var bezier_points_4_d = [];

	//Puntos de la curva de Bezier final con la forma de la superficie del barco
	//Se requieren puntos en distintos niveles para generar la superficie de barrido
	var bezier_first_level = [];
	var bezier_second_level = [];
	var bezier_third_level = [];
    var bezier_4_level = [];
    var bezier_5_level = [];
    var bezier_6_level = [];
    var bezier_7_level = [];

	var bezier_first_level_d = [];
	var bezier_second_level_d = [];
	var bezier_third_level_d = [];
    var bezier_4_level_d = [];
    var bezier_5_level_d = [];
    var bezier_6_level_d = [];
    var bezier_7_level_d = [];

    var bezier_intermediate_level = [];

	//Todos los puntos de la malla para el barco
	var bezier_final = [];
	var bezier_final_d = [];
	var color_buffer = [];
	var index_buffer = [];
    var texture_buffer = [];

    var webgl_position_buffer = null;
    var webgl_normal_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;
    var webgl_texture_coord_buffer = null;

	var createBases = function(){

		Base0=function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3

		Base1=function(u) { return 3*(1-u)*(1-u)*u; }

		Base2=function(u) { return 3*(1-u)*u*u;}

		Base3=function(u) { return u*u*u; }

		//Bases derivadas

		Base0der=function(u) { return -3*u*u+6*u-3;} //-3u2 +6u -3

		Base1der=function(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3

		Base2der=function(u) { return -9*u*u+6*u;}		 // -9u2 +6u

		Base3der=function(u) { return 3*u*u; }			// 3u2

	}

	var createControlPoints = function(){

		//Puntos de control utilizados para la base del barco

		//Trompa del barco
		//control_points_1 = [[10,0,6] , [0,0,1] , [0,0,-1] , [10,0,-6]];
		control_points_1 = [[-8,0,6] , [-18,0,1] , [-18,0,-1] , [-8,0,-6]];

		//Costado inferior del barco
		//control_points_2 = [[10,0,-6] , [15,0,-6] , [20,0,-6] , [25,0,-6]];
		control_points_2 = [[-8,0,-6] , [-3,0,-6] , [2,0,-6] , [7,0,-6]];

		//Cola del barco
		//control_points_3 = [[25,0,-6] , [28,0,-6] , [28,0,6] , [25,0,6]];
		control_points_3 = [[7,0,-6] , [10,0,-6] , [10,0,6] , [7,0,6]];

		//Costado superior del barco
		//control_points_4 = [[25,0,6] , [20,0,6] , [15,0,-6] , [10,0,-6]];
		control_points_4 = [[7,0,6] , [2,0,6] , [-3,0,6] , [-8,0,6]];

	}

    var CalcularPuntoBezier = function (u,buffer){

        var p0=buffer[0];
        var p1=buffer[1];
        var p2=buffer[2];
        var p3=buffer[3];

        var punto = new Object();

        punto.x = Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
        punto.y = Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
        punto.z = Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

        return punto;
    }

    var CalcularNormalPuntoBezier = function (u, buffer){

        var p0=buffer[0];
        var p1=buffer[1];
        var p2=buffer[2];
        var p3=buffer[3];

        var derivadaPunto = new Object();
        var normalPunto = new Object();

		derivadaPunto.x = Base0der(u)*p0[0]+Base1der(u)*p1[0]+Base2der(u)*p2[0]+Base3der(u)*p3[0];
		derivadaPunto.y = Base0der(u)*p0[1]+Base1der(u)*p1[1]+Base2der(u)*p2[1]+Base3der(u)*p3[1];
		derivadaPunto.z = Base0der(u)*p0[2]+Base1der(u)*p1[2]+Base2der(u)*p2[2]+Base3der(u)*p3[2];

		normalPunto.x = -derivadaPunto.z;
		normalPunto.y = 0; //Es fijo
		normalPunto.z = derivadaPunto.x;

		//Normalizo el punto
		var modulo = Math.sqrt((normalPunto.x * normalPunto.x) + (normalPunto.z * normalPunto.z));
		normalPunto.x = (normalPunto.x / modulo);
		normalPunto.z = (normalPunto.z / modulo);

		return normalPunto;
    }

	var createBezierCurvePoints = function(){

        var currentU = 0;
        while (currentU < 1){

        	//Para la trompa
            var punto_cp1 = CalcularPuntoBezier(currentU,control_points_1);
            bezier_points_1.push(punto_cp1.x);
            bezier_points_1.push(punto_cp1.y);
            bezier_points_1.push(punto_cp1.z);

        	//Para costado inferior
            var punto_cp2 = CalcularPuntoBezier(currentU,control_points_2);
            bezier_points_2.push(punto_cp2.x);
            bezier_points_2.push(punto_cp2.y);
            bezier_points_2.push(punto_cp2.z);

        	//Para cola
            var punto_cp3 = CalcularPuntoBezier(currentU,control_points_3);
            bezier_points_3.push(punto_cp3.x);
            bezier_points_3.push(punto_cp3.y);
            bezier_points_3.push(punto_cp3.z);

        	//Para costado superior
            var punto_cp4 = CalcularPuntoBezier(currentU,control_points_4);
            bezier_points_4.push(punto_cp4.x);
            bezier_points_4.push(punto_cp4.y);
            bezier_points_4.push(punto_cp4.z);

            //Normal en el punto

        	//Para la trompa
            var punto_cp1_d = CalcularNormalPuntoBezier(currentU,control_points_1);
            bezier_points_1_d.push(punto_cp1_d.x);
            bezier_points_1_d.push(punto_cp1_d.y);
            bezier_points_1_d.push(punto_cp1_d.z);

        	//Para costado inferior
            var punto_cp2_d = CalcularNormalPuntoBezier(currentU,control_points_2);
            bezier_points_2_d.push(punto_cp2_d.x);
            bezier_points_2_d.push(punto_cp2_d.y);
            bezier_points_2_d.push(punto_cp2_d.z);

        	//Para cola
            var punto_cp3_d = CalcularNormalPuntoBezier(currentU,control_points_3);
            bezier_points_3_d.push(punto_cp3_d.x);
            bezier_points_3_d.push(punto_cp3_d.y);
            bezier_points_3_d.push(punto_cp3_d.z);

        	//Para costado superior
            var punto_cp4_d = CalcularNormalPuntoBezier(currentU,control_points_4);
            bezier_points_4_d.push(punto_cp4_d.x);
            bezier_points_4_d.push(punto_cp4_d.y);
            bezier_points_4_d.push(punto_cp4_d.z);
            
            currentU+=0.10;
        }

        //AGREGO ULTIMO PUNTO
        var ultimoPunto = CalcularPuntoBezier(1,control_points_4);
        bezier_points_4.push(ultimoPunto.x);
        bezier_points_4.push(ultimoPunto.y);
        bezier_points_4.push(ultimoPunto.z);

		var ultimoPunto_d = CalcularNormalPuntoBezier(1,control_points_4);
        bezier_points_4_d.push(ultimoPunto_d.x);
        bezier_points_4_d.push(ultimoPunto_d.y);
        bezier_points_4_d.push(ultimoPunto_d.z);

        /*
        console.log("------ POINTS 1 ------");
        console.log(bezier_points_1);
        console.log(bezier_points_1_d);
        console.log("------ POINTS 2 ------");
        console.log(bezier_points_2);
		console.log(bezier_points_2_d);
        console.log("------ POINTS 3 ------");
        console.log(bezier_points_3);
        console.log(bezier_points_3_d);
        console.log("------ POINTS 4 ------");
        console.log(bezier_points_4);
        console.log(bezier_points_4_d);*/

	}

	var createBezierFirstLevelSurface = function(){

		for (var i = 0; i<bezier_points_1.length ; i++) {
			bezier_first_level.push(bezier_points_1[i]);
			bezier_first_level_d.push(bezier_points_1_d[i]);
		}
		
		for (var i = 0; i<bezier_points_2.length ; i++) {
			bezier_first_level.push(bezier_points_2[i]);
			bezier_first_level_d.push(bezier_points_2_d[i]);
		}

		for (var i = 0; i<bezier_points_3.length ; i++) {
			bezier_first_level.push(bezier_points_3[i]);
			bezier_first_level_d.push(bezier_points_3_d[i]);
		}

		for (var i = 0; i<bezier_points_4.length ; i++) {
			bezier_first_level.push(bezier_points_4[i]);
			bezier_first_level_d.push(bezier_points_4_d[i]);
		}

		//console.log("----- FIRST LEVEL -----");
		//console.log(bezier_first_level);

	}

	var expandPoints = function(_bufferIN, _bufferOUT){

		var i;
		for (i = 0; i < _bufferIN.length; i = i+3) {
			_bufferOUT.push(_bufferIN[i]*1.05);
			_bufferOUT.push(_bufferIN[i+1]-1);
			_bufferOUT.push(_bufferIN[i+2]*1.05);
		}

	}

	var createBezierSecondLevelSurface = function(){

		expandPoints(bezier_first_level, bezier_second_level);
		expandPoints(bezier_first_level_d, bezier_second_level_d);

		//console.log("----- SECOND LEVEL -----");
		//console.log(bezier_second_level);	
	}

	var createBezierThirdLevelSurface = function(){

		expandPoints(bezier_second_level, bezier_third_level);
		expandPoints(bezier_second_level_d, bezier_third_level_d);

		//console.log("----- THIRD LEVEL -----");
		//console.log(bezier_third_level);	
	}

    var createBezier4LevelSurface = function(){
        expandPoints(bezier_third_level, bezier_4_level);
        expandPoints(bezier_third_level_d, bezier_4_level_d);
    }

    var createBezier5LevelSurface = function(){
        expandPoints(bezier_4_level, bezier_5_level);
        expandPoints(bezier_4_level_d, bezier_5_level_d);
    }

    var createBezier6LevelSurface = function(){
        expandPoints(bezier_5_level, bezier_6_level);
        expandPoints(bezier_5_level_d, bezier_6_level_d);
    }

    var createBezier7LevelSurface = function(){
        expandPoints(bezier_6_level, bezier_7_level);
        expandPoints(bezier_6_level_d, bezier_7_level_d);
    }

	var joinPoints = function(){

        //var bezier_intermediate_level = [-4, -3, 0];

		for (var i = 0; i < bezier_first_level.length; i = i+3) { 

			bezier_final.push(bezier_first_level[i]);
			bezier_final.push(bezier_first_level[i+1]);
			bezier_final.push(bezier_first_level[i+2]);

			bezier_final.push(bezier_second_level[i]);
			bezier_final.push(bezier_second_level[i+1]);
			bezier_final.push(bezier_second_level[i+2]);

            //bezier_final.push(bezier_intermediate_level[0]);
            //bezier_final.push(bezier_intermediate_level[1]);
            //bezier_final.push(bezier_intermediate_level[2]);

            //bezier_final.push(bezier_second_level[i]);
            //bezier_final.push(bezier_second_level[i+1]);
            //bezier_final.push(bezier_second_level[i+2]);

			bezier_final.push(bezier_third_level[i]);
			bezier_final.push(bezier_third_level[i+1]);
			bezier_final.push(bezier_third_level[i+2]);

            bezier_final.push(bezier_4_level[i]);
            bezier_final.push(bezier_4_level[i+1]);
            bezier_final.push(bezier_4_level[i+2]);

            bezier_intermediate_level.push(bezier_5_level[i]);
            bezier_intermediate_level.push(bezier_5_level[i+1]);
            bezier_intermediate_level.push(bezier_5_level[i+2]);

            bezier_final.push(bezier_5_level[i]);
            bezier_final.push(bezier_5_level[i+1]);
            bezier_final.push(bezier_5_level[i+2]);

            bezier_final.push(bezier_6_level[i]);
            bezier_final.push(bezier_6_level[i+1]);
            bezier_final.push(bezier_6_level[i+2]);

            bezier_final.push(bezier_7_level[i]);
            bezier_final.push(bezier_7_level[i+1]);
            bezier_final.push(bezier_7_level[i+2]);

            //-------------DERIVADA/NORMAL ------------
			bezier_final_d.push(bezier_first_level_d[i]);
			bezier_final_d.push(0);
			bezier_final_d.push(bezier_first_level_d[i+2]);

			bezier_final_d.push(bezier_second_level_d[i]);
			bezier_final_d.push(0);
			bezier_final_d.push(bezier_second_level_d[i+2]);

			bezier_final_d.push(bezier_third_level_d[i]);
			bezier_final_d.push(0);
			bezier_final_d.push(bezier_third_level_d[i+2]);

            bezier_final_d.push(bezier_4_level_d[i]);
            bezier_final_d.push(0);
            bezier_final_d.push(bezier_4_level_d[i+2]);

            bezier_final_d.push(bezier_5_level_d[i]);
            bezier_final_d.push(0);
            bezier_final_d.push(bezier_5_level_d[i+2]);

            bezier_final_d.push(bezier_6_level_d[i]);
            bezier_final_d.push(0);
            bezier_final_d.push(bezier_6_level_d[i+2]);

            bezier_final_d.push(bezier_7_level_d[i]);
            bezier_final_d.push(0);
            bezier_final_d.push(bezier_7_level_d[i+2]);
		} 

		//console.log("----- FINAL BEZIER -----");
		//console.log(bezier_final);
		//console.log(bezier_final_d);

        tapa = new TapaBarco(bezier_intermediate_level);

	}

    var createColorBuffer = function(){

        for (var i = 0; i < 315; i++) {  //355 con el intermediate
           color_buffer.push(0.0);
           color_buffer.push(0.0);
           color_buffer.push(0.0);
       };
        
    }

    var createIndexBuffer = function(){
        index_buffer = [];
        var cols = 7;
        var rows = 45;
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
        var cols = 7; //Niveles
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

        webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezier_final_d), gl.STATIC_DRAW); 

        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezier_final), gl.STATIC_DRAW);

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
        
        mat4.scale(modelMatrix, modelMatrix, [0.125,0.125,0.125]);
        mat4.translate(modelMatrix, modelMatrix, [-60.0, 0, 0]);
        
        return modelMatrix;

    }

    this.initialize = function(){
        createBases();
        createControlPoints();
        createBezierCurvePoints();
        createBezierFirstLevelSurface();
        createBezierSecondLevelSurface();
        createBezierThirdLevelSurface();
        createBezier4LevelSurface();
        createBezier5LevelSurface();
        createBezier6LevelSurface();
        createBezier7LevelSurface();
        joinPoints();
        createColorBuffer();
        createIndexBuffer();
        createTextureBuffer();
        setupWebGLBuffers();

        //Tapa del barco
        tapa.initialize();
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
        gl.bindTexture(gl.TEXTURE_2D, barcoTexture);
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

        var vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        // Dibujamos.
        //gl.drawElements(gl.POINTS_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);

        tapa.draw(viewMatrix);
    }

}