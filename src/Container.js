function Container (_posicion) {

    var posicion = _posicion;
    var formaContainer = new Container3D();

    this.colorear = function(){
        formaContainer.setColor([Math.random(), Math.random(),Math.random()]);
    }

    this.ubicar = function(){
        formaContainer.translate(posicion[0],posicion[1],posicion[2]);
        formaContainer.scale([3/16,3/32,3/32]);
        formaContainer.rotate(Math.PI/2, [1,0,0]);
    }

    this.translate = function(x,y,z){
        posicion[0] += x;
        posicion[1] += y;
        posicion[2] += z;
    }

    this.reset = function(){
        formaContainer.reset();
        this.ubicar();
    }

    this.getPosicion = function(){
        return posicion;
    }

    this.draw = function(viewMatrix, textura){
        formaContainer.initialize();
        formaContainer.draw(viewMatrix, textura);
    }

}