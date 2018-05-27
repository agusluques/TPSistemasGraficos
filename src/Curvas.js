function Curva () {

    var Base0,Base1,Base2,Base3;
    var Base0der,Base1der,Base2der,Base3der;
    var position_buffer;
    var position_buffer1, position_buffer2, position_buffer3, position_buffer4;
    var bspline1, bspline2, bspline3, bspline4;
    var bsplineR1, bsplineR2, bsplineR3, bsplineR4;
    var l1 = []; var l2 = []; var l3 = []; var l4 = []; var l5 = [];
    var puntosFinales = [];

    var position_render_buffer = [];
    var position_render_buffer_rotado = [];
    var color_buffer, index_buffer;

    var webgl_position_buffer = null;
    var webgl_color_buffer = null;
    var webgl_index_buffer = null;

    Base0=function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6
    Base1=function(u) { return (4-6*u*u+3*u*u*u)*1/6; }  // (4  -6u2 +3u3)/6
    Base2=function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6
    Base3=function(u) { return (u*u*u)*1/6; }  //    u3/6   

    var puntosSegunU = function(u, buffer, numeroCurva){

        switch (buffer) {
            case 1:
                var p0=position_buffer1[0];
                var p1=position_buffer1[1];
                var p2=position_buffer1[2];
                var p3=position_buffer1[3];
                break; 
            case 2:
                var p0=position_buffer2[0];
                var p1=position_buffer2[1];
                var p2=position_buffer2[2];
                var p3=position_buffer2[3];
                break; 
            case 3:
                var p0=position_buffer3[0];
                var p1=position_buffer3[1];
                var p2=position_buffer3[2];
                var p3=position_buffer3[3];
                break; 
            case 4:
                var p0=position_buffer4[0];
                var p1=position_buffer4[1];
                var p2=position_buffer4[2];
                var p3=position_buffer4[3];
                break; 
            default: 
                console.log("No debería entrar acá");
        }           

        var punto=new Object();

        punto.x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
        punto.y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
        punto.z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

        switch (numeroCurva) {
            case 1:
                bspline1.push(punto);
                break; 
            case 2:
                bspline2.push(punto);
                break; 
            case 3:
                bspline3.push(punto);
                break; 
            case 4:
                bspline4.push(punto);
                break; 
            default: 
                console.log("No debería entrar acá");
        }
    }

    var CurvaCubica=function (u){

        var p0=position_buffer[0];
        var p1=position_buffer[1];
        var p2=position_buffer[2];
        var p3=position_buffer[3];

        var punto=new Object();

        punto.x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
        punto.y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
        punto.z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

        position_render_buffer.push(punto.x);
        position_render_buffer.push(punto.y);
        position_render_buffer.push(punto.z);

        // ROTACION DE LOS PUNTOS
        var puntoRotado = new Object();
        var angulo = Math.PI/4;
        while(angulo <= (Math.PI*2) ){
            if (position_render_buffer_rotado.length == 0){
                for (var i = 0; i < 9; i++) {
                    position_render_buffer_rotado.push(p0[0]);
                    position_render_buffer_rotado.push(p0[1] - 130);
                    position_render_buffer_rotado.push(p0[2]);
                }
            }
            puntoRotado.x = ((punto.x * Math.cos(angulo)) - (punto.z * Math.sin(angulo)));
            puntoRotado.y = punto.y;
            puntoRotado.z = (( punto.x * Math.sin(angulo)) + (punto.z * Math.cos(angulo)));
            
            position_render_buffer_rotado.push(puntoRotado.x);
            position_render_buffer_rotado.push(puntoRotado.y);
            position_render_buffer_rotado.push(puntoRotado.z);

            
            angulo = angulo + Math.PI/4;
        }
        puntoRotado.x = ((punto.x * Math.cos(angulo)) - (punto.z * Math.sin(angulo)));
        puntoRotado.y = punto.y;
        puntoRotado.z = (( punto.x * Math.sin(angulo)) + (punto.z * Math.cos(angulo)));
        
        position_render_buffer_rotado.push(puntoRotado.x);
        position_render_buffer_rotado.push(puntoRotado.y);
        position_render_buffer_rotado.push(puntoRotado.z);


        return punto;
    }

    var rotarBspline = function(_bspline, _angulo, _bsplineR){
        for (var i = 0; i < _bspline.length; i++) {
            var puntoRotado = new Object();
            puntoRotado.x = ((_bspline[i].x * Math.cos(_angulo)) - (_bspline[i].z * Math.sin(_angulo)));
            puntoRotado.y = _bspline[i].y;
            puntoRotado.z = (( _bspline[i].x * Math.sin(_angulo)) + (_bspline[i].z * Math.cos(_angulo)));
            _bsplineR.push(puntoRotado);
            switch (i) {
                case 0:
                    l1.push(puntoRotado);
                    break; 
                case 1:
                    l2.push(puntoRotado);
                    break; 
                case 2:
                    l3.push(puntoRotado);
                    break; 
                case 3:
                    l4.push(puntoRotado);
                    break; 
                case 4:
                    l5.push(puntoRotado);
                    break; 
                default: 
                    console.log("No debería entrar acá");
            }
        }
    }

    var rotarBsplines = function(){

        var angulo = 0;
        for (var i = 0; i < 4; i++) {

            rotarBspline(bspline1, angulo, bsplineR1);
            rotarBspline(bspline2, angulo, bsplineR2);
            rotarBspline(bspline3, angulo, bsplineR3);
            rotarBspline(bspline4, angulo, bsplineR4);

            angulo = angulo + 5*Math.PI/8;
        } 
    }

    var unirBsplinePorNiveles = function(){
        for (var i = 0; i < l1.length; i++) {

            puntosFinales.push(l1[i].x);
            puntosFinales.push(l1[i].y);
            puntosFinales.push(l1[i].z);

            puntosFinales.push(l2[i].x);
            puntosFinales.push(l2[i].y);
            puntosFinales.push(l2[i].z);

            puntosFinales.push(l3[i].x);
            puntosFinales.push(l3[i].y);
            puntosFinales.push(l3[i].z);

            puntosFinales.push(l4[i].x);
            puntosFinales.push(l4[i].y);
            puntosFinales.push(l4[i].z);   

            puntosFinales.push(l5[i].x);
            puntosFinales.push(l5[i].y);
            puntosFinales.push(l5[i].z);        
        }
    }

    var createPoints = function(){

        position_buffer =[ [0,450, 0] , [200,300, 0] , [600,130, 0] , [700,0, 0] ];

        //Eje YX +
        position_buffer1 =[ [0,450, 0] , [200,300, 0] , [600,130, 0] , [700,0, 0] ];
        bspline1 = [];
        bsplineR1 = [];

        //Eje YZ +
        position_buffer2 =[ [0,700, 0] , [0,600, 245] , [0,230, 510] , [0,0, 900] ];
        bspline2 = [];
        bsplineR2 = [];

        //Eje YX -
        position_buffer3 =[ [0,350, 0] , [-200,400, 0] , [-475,345, 0] , [-750,0, 0] ];
        bspline3 = [];
        bsplineR3 = [];

        //EJE YZ - 
        position_buffer4 =[ [0,300, 0] , [0,200, -80] , [0,50, -200] , [0,0, -300] ];
        bspline4 = [];
        bsplineR4 = [];

        color_buffer = [];

        var currentU = 0;
        while (currentU <= 1){
            var punto = CurvaCubica(currentU);
            //for (var i = 0; i < 4; i++) {
            //    puntosSegunU(currentU, i+1, i+1);
            //}
            currentU+=0.25;
        }
        /*
        console.log(bspline1);
        console.log(bspline2);
        console.log(bspline3);
        console.log(bspline4);

        rotarBsplines();
        console.log(bsplineR1);
        console.log(bsplineR2);
        console.log(bsplineR3);
        console.log(bsplineR4);

        console.log(l1);
        console.log(l2);
        console.log(l3);
        console.log(l4);
        console.log(l5);

        unirBsplinePorNiveles();
        console.log(puntosFinales);*/

        for (var i = 0.0; i < 6; i++) { 
           for (var j = 0.0; j < 9; j++) {
               // Para cada vértice definimos su color
               color_buffer.push(0.6);
               color_buffer.push(0.3);
               color_buffer.push(0.17);
                                      
           };
        };

    }

    var createIndexBuffer = function(){
        index_buffer = [];
        var cols = 9;
        var rows = 6;
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
        var min = Math.min.apply(null, position_render_buffer_rotado),
            max = Math.max.apply(null, position_render_buffer_rotado)
        position_render_buffer_rotado = position_render_buffer_rotado.map(function(e) { 
                                          e = ((25*(e - min))/(max - min)) -5
                                          return e;
                                        });
        //console.log(position_render_buffer_rotado);
        //console.log(index_buffer);
        //console.log(color_buffer);
        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_render_buffer_rotado), gl.STATIC_DRAW);

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
        mat4.translate(modelMatrix, modelMatrix, [0, -10, -10]);
        
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