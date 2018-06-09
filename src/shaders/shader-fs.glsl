precision highp float;

varying vec2 vUv;
varying highp vec4 vColor;

uniform sampler2D uTextura;

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0); 
	vec4 textColor = texture2D(uTextura, vUv);

	color.x = textColor.x + vColor.x;
	color.y = textColor.y + vColor.y;
	color.z = textColor.z + vColor.z;
  // gl_FragColor es una variable "built-in" de GLSL que es usada para 
  // almacenar el color resultante del fragmento.
  gl_FragColor = color;
}