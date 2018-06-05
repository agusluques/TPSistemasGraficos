function Isla () {

	var Base0,Base1,Base2,Base3;

	//Puntos de control para crear las curvas BSpline
	//Se utilizarán 4 curvas BSpline
	var control_points_1 = [];
	var control_points_2 = [];
	var control_points_3 = [];
	var control_points_4 = [];

	//Puntos de las curvas BSpline intermedias obtenidos de los puntos de control
	var bspline_points_1 = [];
	var bspline_points_2 = [];
	var bspline_points_3 = [];
	var bspline_points_4 = [];

	//Puntos de la curva BSpline final con la forma de la isla
	//Se requiere rotar esta misma curva alrededor del eje Y para formar la isla completa
	var bspline_first = [];

	//Todos los puntos de la malla para la isla
	var bspline_final = [];
	var color_buffer = [];
	var index_buffer = [];

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

    Base0=function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6
    Base1=function(u) { return (4-6*u*u+3*u*u*u)*1/6; }  // (4  -6u2 +3u3)/6
    Base2=function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6
    Base3=function(u) { return (u*u*u)*1/6; }  //    u3/6 

	var createControlPoints = function(){

		//Tramo inferior de la isla
		control_points_1 = [ [525,135,0] , [583,120,0] , [641,105,0] , [700,100,0] ];

		control_points_2 = [ [350,165, 0] , [408,160, 0] , [466,150, 0] , [525,135,0] ];
		control_points_3 = [ [-200,700,0] , [233,292, 0] , [291,196, 0] , [350,165, 0] ];

		//Tramo superior de la isla
		control_points_4 = [ [0,550,0] , [58,500,0] , [116,450,0] , [350,100,0] ];

	}

	var createFirstBSpline = function(){

		for (var i = 0; i<bspline_points_1.length ; i++) {
			bspline_first.push(bspline_points_1[i]);
		}
		
		for (var i = 0; i<bspline_points_2.length ; i++) {
			bspline_first.push(bspline_points_2[i]);
		}

		for (var i = 0; i<bspline_points_3.length ; i++) {
			bspline_first.push(bspline_points_3[i]);
		}

		for (var i = 0; i<bspline_points_4.length ; i++) {
			bspline_first.push(bspline_points_4[i]);
		}

		//console.log("----- FIRST BSPLINE -----");
		//console.log(bspline_first);

	}

	var rotatePoints = function(){

		//Agrego la primer curva sin rotar
		bspline_final.push(0);
		bspline_final.push(400);
		bspline_final.push(0);
		for (var i = 0; i < bspline_first.length; i++) {
			bspline_final.push(bspline_first[i]);
		}
        
        // Rotacion de los puntos
        var puntoRotado = new Object();
        var angulo = 5*Math.PI/180; //Roto de a 5° grados
        //var angulo = Math.PI/4;
        var anguloPlaya = Math.PI/4;

        while(angulo <= (Math.PI*2)){

			bspline_final.push(0);
			bspline_final.push(400);
			bspline_final.push(0);

			for (var i = 0; i < bspline_first.length; i = i +3) {
				
	            puntoRotado.x = ((bspline_first[i] * Math.cos(angulo)) - (bspline_first[i+2] * Math.sin(angulo)));
	            puntoRotado.y = bspline_first[i+1];
	            puntoRotado.z = ((bspline_first[i] * Math.sin(angulo)) + (bspline_first[i+2] * Math.cos(angulo)));


	            //Agrego algo de ruido
	            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	            puntoRotado.x += (plusOrMinus*(Math.floor((Math.random() * 10) + 1)));
	            puntoRotado.z += (plusOrMinus*(Math.floor((Math.random() * 10) + 1)));


	            bspline_final.push(puntoRotado.x);
	            bspline_final.push(puntoRotado.y);
	            bspline_final.push(puntoRotado.z);
			}
           
            angulo = angulo + (5*Math.PI/180);
            //angulo = angulo + Math.PI/4;
        }

        //console.log("----- BSpline final------");
        //console.log(bspline_final);
	}

    var CalcularPuntoBSpline = function (u,buffer){

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

	var createBSplineCurvePoints = function(){

        var currentU = 0;
        while (currentU < 1){

        	//Para la parte inferior
            var punto_cp1 = CalcularPuntoBSpline(currentU,control_points_1);
            bspline_points_1.push(punto_cp1.x);
            bspline_points_1.push(punto_cp1.y);
            bspline_points_1.push(punto_cp1.z);

            var punto_cp2 = CalcularPuntoBSpline(currentU,control_points_2);
            bspline_points_2.push(punto_cp2.x);
            bspline_points_2.push(punto_cp2.y);
            bspline_points_2.push(punto_cp2.z);

            var punto_cp3 = CalcularPuntoBSpline(currentU,control_points_3);
            bspline_points_3.push(punto_cp3.x);
            bspline_points_3.push(punto_cp3.y);
            bspline_points_3.push(punto_cp3.z);

        	//Para la parte superior
            var punto_cp4 = CalcularPuntoBSpline(currentU,control_points_4);
            bspline_points_4.push(punto_cp4.x);
            bspline_points_4.push(punto_cp4.y);
            bspline_points_4.push(punto_cp4.z);
            
            currentU+=0.10;
        }

        //AGREGO ULTIMO PUNTO
        //var ultimoPunto = CalcularPuntobspline(1,control_points_4);
        //bspline_points_4.push(ultimoPunto.x);
        //bspline_points_4.push(ultimoPunto.y);
        //bspline_points_4.push(ultimoPunto.z);

        /*
        console.log("------ POINTS 1 ------");
        console.log(bspline_points_1);
        console.log("------ POINTS 2 ------");
        console.log(bspline_points_2);
        console.log("------ POINTS 3 ------");
        console.log(bspline_points_3);
        console.log("------ POINTS 4 ------");
        console.log(bspline_points_4);*/
	}

    var createColorBuffer = function(){

        for (var i = 0; i < 3285; i++) { 
           color_buffer.push(0.5);
           color_buffer.push(0.5);
           color_buffer.push(0.5);
       };
        
    }

    var createIndexBuffer = function(){

        index_buffer = [];
        var cols = 45;
        var rows = 73;
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
        var min = Math.min.apply(null, bspline_final),
            max = Math.max.apply(null, bspline_final)
        	bspline_final = bspline_final.map(function(e) { 
                                          e = ((25*(e - min))/(max - min)) -5
                                          return e;
                                        });

        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bspline_final), gl.STATIC_DRAW);

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
        
        mat4.rotate(modelMatrix, modelMatrix, Math.PI, [1,0,0]);
        mat4.scale(modelMatrix, modelMatrix, [1,1,2]);
        mat4.translate(modelMatrix, modelMatrix, [0, -10, -10]);
        
        return modelMatrix;

    }

    this.initialize = function(){
        createControlPoints();
        createBSplineCurvePoints();
        createFirstBSpline();
        rotatePoints();
        createColorBuffer();
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