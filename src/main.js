var canvas, gl;
var mvMatrix = mat4.create();
var t = 0.0, frame = 0;

function setupWebGL()
{
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.enable(gl.DEPTH_TEST);                              
    gl.depthFunc(gl.LEQUAL); 
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initWebGL(){
	try{
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");                    
    }catch(e){
    	throw e;
    }
                    
    if(gl)
    {
        setupWebGL();
        initShaders();
        setupBuffers();
        setInterval(drawScene, 10);  
    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }
}


function start(){
	canvas = document.getElementById("my-canvas");
	initWebGL();   
}



function getShader(gl, id) {
    var shaderScript, src, currentChild, shader;

    // Obtenemos el elemento <script> que contiene el código fuente del shader.
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    // Extraemos el contenido de texto del <script>.
    src = "";
    currentChild = shaderScript.firstChild;
    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            src += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // Creamos un shader WebGL según el atributo type del <script>.
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    // Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
    gl.shaderSource(shader, src);

    // Compilamos el shader.
    gl.compileShader(shader);  
      
    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + 
            gl.getShaderInfoLog(shader));  
      return null;  
    }
      
    return shader;
}

function initShaders()
{
    // Obtenemos los shaders ya compilados
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Creamos un programa de shaders de WebGL.
    glProgram = gl.createProgram();

    // Asociamos cada shader compilado al programa.
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);

    // Linkeamos los shaders para generar el programa ejecutable.
    gl.linkProgram(glProgram);

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(glProgram));
      return null;
    }

    // Le decimos a WebGL que de aquí en adelante use el programa generado.
    gl.useProgram(glProgram);
}


function setupBuffers()
{
    my_grid = new VertexGrid(40,5);
    my_grid.initialize();


    my_camera = new Camera();
    my_camera.setPerspective(45, 640.0/480.0, 0.1, 100.0)

    
}

function drawScene()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");
    // Preparamos una matriz de perspectiva.
    gl.uniformMatrix4fv(u_proj_matrix, false, my_camera.getProjectionMatrix());

    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
    // Preparamos una matriz de modelo+vista.
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -5.0]);
    mat4.rotate(mvMatrix, mvMatrix, t, [0.0, 1.0, 0.0]);
    t = t + 0.01;

    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);

    my_grid.draw();

}