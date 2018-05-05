function Camera(){
	//var aspect = gl.viewportWidth / gl.viewportHeight;
	//var zNear = 1;
	//var zFar = 2000;
	var projectionMatrix = mat4.create();

	this.getProjectionMatrix = function(){
		return projectionMatrix;
	} 
	
	this.setPerspective = function(fieldOfViewRadians, aspect, zNear, zFar){
		mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, zNear, zFar);
	}
}


