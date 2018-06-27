function Muelle(){
	var muelle = new Cubo();

	muelle.translate(-6,0,4);
	muelle.scale([5.5,0.7,2.5]);

	this.initialize = function(){
        muelle.initialize();
    }

    this.draw = function(viewMatrix){

		muelle.draw(viewMatrix, muelleTexture, 50.0);
    }


}