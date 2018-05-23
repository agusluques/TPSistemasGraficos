
// Los atributos son características propias de cada vertice.
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

// Los uniforms son características propias de una etapa de dibujado completa.
// Son comunes a todos los vertices involucrados en el dibujado.
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// Los varying son propiedades que toman valor para cada fragmento a partir
// de interpolar linealmente entre los valores que se les asigna en cada 
// vértice del polígono al cual pertenecen.
varying highp vec4 vColor;    

void main(void) {
    // gl_Position es una variable "built-in" de GLSL que es usada para 
    // almacenar la posición resultante del fragmento.
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = vec4(aVertexColor,1.0);
    gl_PointSize = 10.0;
}
