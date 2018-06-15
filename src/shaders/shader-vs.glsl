
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aUv;
// falta "vec3 aVertexNormal" 



uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uMMatrix;
// falta "mat3 uNMatrix"



varying highp vec4 vColor;
varying vec2 vUv;
varying mat4 vMVMatrix;
varying vec4 vModelPosition;
// falta "vec3 vTransformedNormal"

void main(void) {

	vUv = aUv;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = vec4(aVertexColor,1.0);
    gl_PointSize = 10.0;

    vModelPosition = uMMatrix * vec4(aVertexPosition, 1.0);

    vMVMatrix = uMVMatrix;

    //vTransformedNormal = uNMatrix * aVertexNormal;
}
