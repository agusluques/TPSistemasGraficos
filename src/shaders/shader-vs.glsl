precision highp float;
precision highp int;

attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aUv;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangent;



uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uMMatrix;
uniform mat3 uNMatrix;
uniform float uT;
uniform int uId;
uniform vec3 uCameraPos;



varying highp vec4 vColor;
varying vec2 vUv;
varying mat4 vMVMatrix;
varying vec3 vModelPosition;
varying vec3 vTransformedNormal;
varying vec3 vCameraPosition;

void main(void) {

	vUv = aUv;
	vec3 aVertexPositionAux;

	if (uId == 1){
		aVertexPositionAux = vec3(aVertexPosition.x, aVertexPosition.y + sin(uT + aVertexPosition.x + aVertexPosition.z)/5.0, aVertexPosition.z);
	}else{
		aVertexPositionAux = vec3(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z);
	}

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPositionAux, 1.0);
    vColor = vec4(aVertexColor,1.0);
    gl_PointSize = 10.0;

    vModelPosition = (uMMatrix * vec4(aVertexPosition, 1.0)).xyz;

    vMVMatrix = uMVMatrix;

    vCameraPosition = (uMMatrix * vec4(uCameraPos, 1.0)).xyz;

    vTransformedNormal = uNMatrix * aVertexNormal;
    //vec3 TransformedTangent = normalize(uNMatrix * aVertexTangent);
    //vec3 TransformedBi = normalize(uNMatrix * cross(aVertexNormal, aVertexTangent));
}
