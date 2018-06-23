precision highp float;
precision highp int;

varying vec2 vUv;
varying highp vec4 vColor;
varying mat4 vMVMatrix;
varying vec4 vModelPosition;
varying vec3 vTransformedNormal;

uniform sampler2D uTextura;
uniform sampler2D uTextura2;
// falta "sampler2D uNormalSampler"
uniform float uT;
uniform int uId;

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0);
	vec3 textColor;

	if (uId == 1){
		vec2 offset=vec2(uT*0.01, uT*0.02);
		vec2 offset2=vec2(uT*0.025, uT*0.01);

		vec3 colorAgua1=vec3(0.3,0.5,0.86);
       	vec3 colorAgua2=vec3(0.2,0.5,0.7);

		textColor = mix(colorAgua1*texture2D(uTextura, vUv+offset).xyz, colorAgua2*texture2D(uTextura2, vUv*0.3+ offset2).xyz, 0.5);
	} else{
		textColor = texture2D(uTextura, vUv).xyz;
	}
	

	color.x = textColor.x + vColor.x;
	color.y = textColor.y + vColor.y;
	color.z = textColor.z + vColor.z;
  	gl_FragColor = color;
  	//gl_FragColor = vec4(vTransformedNormal, 1.0);
}