var canvas, gl, glProgram; 
var t = 0.0;
 

function GLInstance(){
    canvas = document.getElementById("my-canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if(!gl){ console.error("WebGL context is not available."); return null; }

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
    
    t = t + 0.01;
    my_camera.setView();
    my_grid.draw();
    //my_bspline.draw();
    //my_point.draw();
}

function start(){
    gl = GLInstance().fSetSize().fClear();

    glProgram = ShaderUtil.domShaderProgram(gl, "shader-vs", "shader-fs", true);
    gl.useProgram(glProgram);

    my_grid = new VertexGrid(5,5);
    my_grid.initialize();

    my_point = new Point();
    my_point.initialize();

    my_bspline = new Curva('bezier3');
    //my_bspline = new Curva('bspline3');
    my_bspline.initialize();
    console.log(my_bspline);
    my_bspline.draw();


    my_camera = new Camera();
    my_camera.setPerspective(55, 640.0/480.0, 0.1, 100.0)


    setInterval(drawScene, 10);
                
}