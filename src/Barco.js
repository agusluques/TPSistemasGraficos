function Barco () {

	var Base0,Base1,Base2,Base3;

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

	//Puntos de la curva de Bezier final con la forma de la superficie del barco
	//Se requieren puntos en distintos niveles para generar la superficie de barrido
	var bezier_first_level = [];
	var bezier_second_level = [];
	var bezier_third_level = [];

	//Todos los puntos de la malla para el barco
	var bezier_final = [];
	var color_buffer = [];
	var index_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

	var createBases = function(){

		Base0=function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3

		Base1=function(u) { return 3*(1-u)*(1-u)*u; }

		Base2=function(u) { return 3*(1-u)*u*u;}

		Base3=function(u) { return u*u*u; }

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
            
            currentU+=0.10;
        }

        //AGREGO ULTIMO PUNTO
        var ultimoPunto = CalcularPuntoBezier(1,control_points_4);
        bezier_points_4.push(ultimoPunto.x);
        bezier_points_4.push(ultimoPunto.y);
        bezier_points_4.push(ultimoPunto.z);

        /*
        console.log("------ POINTS 1 ------");
        console.log(bezier_points_1);
        console.log("------ POINTS 2 ------");
        console.log(bezier_points_2);
        console.log("------ POINTS 3 ------");
        console.log(bezier_points_3);
        console.log("------ POINTS 4 ------");
        console.log(bezier_points_4);*/

	}

	var createBezierFirstLevelSurface = function(){

		for (var i = 0; i<bezier_points_1.length ; i++) {
			bezier_first_level.push(bezier_points_1[i]);
		}
		
		for (var i = 0; i<bezier_points_2.length ; i++) {
			bezier_first_level.push(bezier_points_2[i]);
		}

		for (var i = 0; i<bezier_points_3.length ; i++) {
			bezier_first_level.push(bezier_points_3[i]);
		}

		for (var i = 0; i<bezier_points_4.length ; i++) {
			bezier_first_level.push(bezier_points_4[i]);
		}

		//console.log("----- FIRST LEVEL -----");
		//console.log(bezier_first_level);

	}

	//VERIFICAR QUE EL ESCALADO ESTE FUNCIONANDO BIEN
	var expandPoints = function(_bufferIN, _bufferOUT){

		var i;
		for (i = 0; i < _bufferIN.length; i = i+3) {
			_bufferOUT.push(_bufferIN[i]*1.2);
			_bufferOUT.push(_bufferIN[i+1]-3);
			_bufferOUT.push(_bufferIN[i+2]*1.2);
		}

	}

	var createBezierSecondLevelSurface = function(){

		expandPoints(bezier_first_level, bezier_second_level);

		//console.log("----- SECOND LEVEL -----");
		//console.log(bezier_second_level);	
	}

	var createBezierThirdLevelSurface = function(){

		expandPoints(bezier_second_level, bezier_third_level);

		//console.log("----- THIRD LEVEL -----");
		//console.log(bezier_third_level);	
	}

	var joinPoints = function(){

        var bezier_intermediate_level = [-4, -3, 0];

		for (var i = 0; i < bezier_first_level.length; i = i+3) { 

			bezier_final.push(bezier_first_level[i]);
			bezier_final.push(bezier_first_level[i+1]);
			bezier_final.push(bezier_first_level[i+2]);

			bezier_final.push(bezier_second_level[i]);
			bezier_final.push(bezier_second_level[i+1]);
			bezier_final.push(bezier_second_level[i+2]);

            bezier_final.push(bezier_intermediate_level[0]);
            bezier_final.push(bezier_intermediate_level[1]);
            bezier_final.push(bezier_intermediate_level[2]);

            bezier_final.push(bezier_second_level[i]);
            bezier_final.push(bezier_second_level[i+1]);
            bezier_final.push(bezier_second_level[i+2]);

			bezier_final.push(bezier_third_level[i]);
			bezier_final.push(bezier_third_level[i+1]);
			bezier_final.push(bezier_third_level[i+2]);
		} 

		//console.log("----- FINAL BEZIER -----");
		//console.log(bezier_final);

	}

    var createColorBuffer = function(){

        for (var i = 0; i < 225; i++) { 
           color_buffer.push(0.5);
           color_buffer.push(0.5);
           color_buffer.push(0.5);
       };
        
    }

    var createIndexBuffer = function(){

        index_buffer = [];
        var cols = 5;
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

    // Esta función crea e incializa los buffers dentro del pipeline para luego
    // utlizarlos a la hora de renderizar.
    var setupWebGLBuffers = function(){

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
        joinPoints();
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