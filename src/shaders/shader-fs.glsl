precision highp float;

varying vec2 vUv;
varying highp vec4 vColor;
varying mat4 vMVMatrix;
varying vec4 vModelPosition;
// falta "vec3 vTransformedNormal"

uniform sampler2D uTextura;
// falta "sampler2D uNormalSampler"
uniform float uT;
uniform int uId;

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0);
	vec4 textColor;

	vec2 offset=vec2(uT*0.06,uT*0.07);

	if (uId == 1){
		textColor = texture2D(uTextura, vUv*0.3+offset);
	} else{
		textColor = texture2D(uTextura, vUv);
	}
	

	color.x = textColor.x + vColor.x;
	color.y = textColor.y + vColor.y;
	color.z = textColor.z + vColor.z;
  	gl_FragColor = color;
}