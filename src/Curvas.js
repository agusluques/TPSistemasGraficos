function Curva (_cual) {

    var Base0,Base1,Base2,Base3;
    var Base0der,Base1der,Base2der,Base3der;
    var position_buffer;
    var color_buffer, index_buffer;

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

    // Definimos las Bases de Berstein, dependen de u
    if (_cual=="bezier3"){

         Base0=function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3

         Base1=function(u) { return 3*(1-u)*(1-u)*u; }

         Base2=function(u) { return 3*(1-u)*u*u;}

         Base3=function(u) { return u*u*u; }

         // bases derivadas

         Base0der=function(u) { return -3*u*u+6*u-3;} //-3u2 +6u -3

         Base1der=function(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3

         Base2der=function(u) { return -9*u*u+6*u;}      // -9u2 +6u

         Base3der=function(u) { return 3*u*u; }         // 3u2

    
    } else if (_cual=="bspline3"){ 
        
         Base0=function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6

         Base1=function(u) { return (4-6*u*u+3*u*u*u)*1/6; }  // (4  -6u2 +3u3)/6

         Base2=function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6

         Base3=function(u) { return (u*u*u)*1/6; }  //    u3/6


         Base0der=function(u) { return (-3 +6*u -3*u*u)/6 }  // (-3 +6u -3u2)/6

         Base1der=function(u) { return (-12*u+9*u*u)/6 }   // (-12u +9u2)  /6

         Base2der=function(u) { return (3+6*u-9*u*u)/6;}    // (-3 +6u -9u2)/6

         Base3der=function(u) { return (3*u*u)*1/6; }           
    }

    var CurvaCubica=function (u,position_buffer){

        var p0=position_buffer[0];
        var p1=position_buffer[1];
        var p2=position_buffer[2];
        var p3=position_buffer[3];

        console.log('Punto 0: ' + p0);
        console.log('Punto 1: ' + p1);
        console.log('Punto 2: ' + p2);
        console.log('Punto 3: ' + p3);
        console.log('Valor u: ' + u);

        var punto=new Object();

        punto.x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
        punto.y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
        punto.z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

        return punto;
    }

    //NO LA ESTARIAMOS USANDO
    var CurvaCubicaDerivadaPrimera=function (u,position_buffer){

        var p0=position_buffer[0];
        var p1=position_buffer[1];
        var p2=position_buffer[2];
        var p3=position_buffer[3];

        var punto=new Object();

        punto.x=Base0der(u)*p0[0]+Base1der(u)*p1[0]+Base2der(u)*p2[0]+Base3der(u)*p3[0];
        punto.y=Base0der(u)*p0[1]+Base1der(u)*p1[1]+Base2der(u)*p2[1]+Base3der(u)*p3[1];
        punto.z=Base0der(u)*p0[2]+Base1der(u)*p1[2]+Base2der(u)*p2[2]+Base3der(u)*p3[2];

        return punto;
    }

	//NO LA ESTARIAMOS USANDO
    function dibujarCurvaCubica(position_buffer,dibujarGrafo){

        // devuelve un punto de la curva segun el parametro u entre 0 y 1

        // 4 Puntos de control P0, P1, P2 y P3      
        

        var p0=position_buffer[0];
        var p1=position_buffer[1];
        var p2=position_buffer[2];
        var p3=position_buffer[3];

        ctx.lineWidth=2;
        // Dibujamos la curva en color azul, entre u=0 y u=1 con deltaU

        var deltaU=0.01; // es el paso de avance sobre la curva cuanto mas chico mayor es el detalle
                         // u=0.05 son 20 segmentos (0.05=1/20)
        ctx.clearRect ( 0 , 0 ,1000 , 1000 );
        ctx.beginPath();
        
        
            
        for (u=0;u<=1.001;u=u+deltaU){
            // Tengo que calcular la posicion del punto c(u)


            var punto=CurvaCubica(u,position_buffer);

            if (u==0) ctx.moveTo(punto.x,punto.y);
            ctx.lineTo(punto.x,punto.y);// hago una linea desde el ultimo lineTo hasta x,y
            
            //console.log("C("+u+")= "+punto.x+","+punto.y);
        }
        ctx.strokeStyle="#0000FF";
        ctx.stroke();



        // Dibujo el grafo de control en color rojo, solo para verificar donde esta cada punto de control

        if (dibujarGrafo){
            ctx.beginPath();
            ctx.moveTo(p0[0],p0[1]);
            ctx.lineTo(p1[0],p1[1]);
            ctx.lineTo(p2[0],p2[1]);
            ctx.lineTo(p3[0],p3[1]);
            ctx.strokeStyle="#FF0000";
            ctx.stroke();
        }


    }

    //NO LA ESTARIAMOS USANDO
    function dibujarVector(x1,y1,x2,y2,color){

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x1+x2,y1+y2);
        ctx.strokeStyle=color;
        ctx.stroke();       
    }

    var createPoints = function(){

        position_buffer =[ [100,450, 1] , [200,100, 0] , [600,100, 0] , [700,450, 10] ];
        color_buffer = [[0.2,0.2,0.2], [0.2,0.2,0.2], [0.2,0.2,0.2], [0.2,0.2,0.2]];

    }

    var createIndexBuffer = function(){

        index_buffer = [[0.0] , [0.0] ,[0.0] ,[0.0]];
        
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

    this.initialize = function(){
        createPoints();
        createIndexBuffer();
        setupWebGLBuffers();
    }

    this.draw = function(){

        var currentU = 0;
        while (currentU <= 1){
            var punto = CurvaCubica(currentU,position_buffer);
            console.log(punto);
            currentU+=0.25;
        }

        // REEMPLAZAR POR LO QUE CORRESPONDA
        /*
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
        gl.drawElements(gl.TRIANGLE_STRIP, index_buffer.length, gl.UNSIGNED_SHORT, 0);*/
    }
}