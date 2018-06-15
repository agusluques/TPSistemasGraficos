precision highp float;

varying vec2 vUv;
varying highp vec4 vColor;
varying mat4 vMVMatrix;
varying vec4 vModelPosition;
// falta "vec3 vTransformedNormal"

uniform sampler2D uTextura;
// falta "sampler2D uNormalSampler"

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0); 
	vec4 textColor = texture2D(uTextura, vUv);

	color.x = textColor.x + vColor.x;
	color.y = textColor.y + vColor.y;
	color.z = textColor.z + vColor.z;
  	gl_FragColor = color;
}