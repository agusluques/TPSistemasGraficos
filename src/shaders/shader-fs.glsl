varying highp vec4 vColor;

void main(void) {
  // gl_FragColor es una variable "built-in" de GLSL que es usada para 
  // almacenar el color resultante del fragmento.
  gl_FragColor = vColor;
}