

function Environment(c, renderingContext){  //consists of foreground and background
    this.c = c;
    this.renderingContext = renderingContext;
    this.bgPos = 0;
    this.fgPos= 0;
    this.bgSpeed = 2;
    this.bgwidth = width-20; //width of the background image

    this.update = function(){
        this.bgPos -= this.bgSpeed;
        if(this.bgPos < -this.bgwidth)
            this.bgPos = 0;
    };

    this.render  = function(){
        for(let i = 0; i <= this.c.width/this.bgwidth+1; i++)
        {
            foregroundSprite.drawSprite(this.renderingContext, this.bgPos+i*this.bgwidth, this.c.height-95, 1);

        }
    };

}
