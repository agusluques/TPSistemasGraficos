var canvas, gl, glProgram; 
var t = 0.0;
var anguloAgua = 0;
 

function GLInstance(){
    canvas = document.getElementById("my-canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if(!gl){ console.error("WebGL context is not available."); return null; }


    function resizer(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    window.addEventListener('resize', resizer);
    resizer();

    //...................................................
    //Setup GL, Set all the default configurations we need.
    gl.clearColor(0.1, 0.1, 0.2, 1.0);      //Set clear color
    gl.enable(gl.DEPTH_TEST);                              
    gl.depthFunc(gl.LEQUAL);     


    //...................................................
    //Methods   
    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }


    //...................................................
    //Setters - Getters

    //Set the size of the canvas html element and the rendering view port
    gl.fSetSize = function(){
        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        w = this.canvas.width;
        h = this.canvas.height;

        //when updating the canvas size, must reset the viewport of the canvas 
        //else the resolution webgl renders at will not change
        this.viewport(0,0,w,h);
        return this;
    }

    return gl;
}

function drawScene(shaderProg){
    
    t = t + 0.005;

    requestAnimationFrame(drawScene);

    var viewMatrix = my_camera.getViewMatrix();

    
    gl.uniform1f(glProgram.uT, t);

    gl.uniform1i(glProgram.uId, 0); // se pone a todos id = 0, y el agua se pone id = 1

    
    my_scene.draw(viewMatrix);
    my_water.draw(viewMatrix);
}

var intensidadSol = 0.5;

var initLuces = function(){
    //Acá inicio mi primera luz que quiero que sea la de ambiente
    gl.uniform3f(glProgram.uAmbientColor,0.8,0.8,0.8); // correcto es 0.1,0.1,0.5
    //Luz del sol
    var lightingDirection = [ -30.0,5.0,0.0 ]; // sol
    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    gl.uniform3fv(glProgram.uLightDirection, adjustedLD);
    gl.uniform3f(glProgram.uDirectionalColor,intensidadSol+0.5,intensidadSol,intensidadSol); //El +0.05 es para que sea mas anaranjado por el sol
    // //Luz de la lampara
    // gl.uniform3f(shaderProgram.lampLightOnePosition,-7.0,0.0,0.8);
    // gl.uniform3f(shaderProgram.lampLightTwoPosition,15.0,0.0,0.8);
    // gl.uniform3f(shaderProgram.lampLightColour,0.5,0.3,0.0);    //Naranja
    // gl.uniform3f(shaderProgram.lampLightColourSpecular,0.5,0.5,0.5);    //Blanco
}

function start(){
    gl = GLInstance().fSetSize().fClear();

    initTexture();

    glProgram = ShaderUtil.domShaderProgram(gl, "shader-vs", "shader-fs", true);
    gl.useProgram(glProgram);

    glProgram.uT = gl.getUniformLocation(glProgram, "uT");
    glProgram.uId = gl.getUniformLocation(glProgram, "uId");

    glProgram.uAmbientColor = gl.getUniformLocation(glProgram, "uAmbientColor");
    glProgram.uLightDirection = gl.getUniformLocation(glProgram, "uLightDirection");
    glProgram.uDirectionalColor = gl.getUniformLocation(glProgram, "uDirectionalColor");

    glProgram.uTarget = gl.getUniformLocation(glProgram, "uTarget");
    glProgram.uCameraPos = gl.getUniformLocation(glProgram, "uCameraPos");

    initLuces();

    my_scene = new Scene();
    my_scene.initialize();

    my_water = new Water();
    my_water.initialize();

    my_camera = new Camera();
    my_camera.setPerspective(55, 640.0/480.0, 0.1, 1000.0)


    drawScene();
                
}