function main(gs) {
    /*** Define some different types of things ***/
    t_pusher = 1;
    t_box = 2;

    WIDTH = gs.width;
    HEIGHT = gs.height;

    pic = 30;

    function Pusher(gs) {
        this.type = t_pusher;
        this.x = 0;
        this.y = 0;

        this.speed= 4;

        this.direction = [0, 0]; 


        this.keyHeld_40 = this.keyDown_40 = function(){
            this.direction = [0, 1];
        }

        this.keyHeld_37 = this.keyDown_37 = function(){
            this.direction = [-1, 0];
        }

        this.keyHeld_38 = this.keyDown_38 = function(){
            this.direction = [0, -1];
        }

        this.keyHeld_39 = this.keyDown_39 = function(){
            this.direction = [1, 0];
        }

        this.keyUp_37 = this.keyUp_38 = this.keyUp_39 = this.keyUp_40 = function () {
            this.direction = [0, 0];
        }



        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            
            if (this.x < 0)
                this.x = 0;
            else if (this.x + pic > WIDTH)
                this.x = this.x - this.speed;
            else if (this.y < 0)
                this.y = 0;
            else if (this.y + pic > HEIGHT)
                this.y = this.y - this.speed;
        }
        

        this.draw = function(c) {
            c.fillStyle = 'rgba(200, 200, 200, 0.5)';
            c.beginPath();
            c.rect(this.x, this.y, pic, pic);
            c.closePath();
            c.fill();
        }

        this.get_collision_aabb = function() {
        
            return [this.x, this.y, pic, pic];
        }

        this.collide_aabb = function(who) {
            if (who.type == t_box) {
                this.x -= this.direction[0] * this.speed * 2;
                this.y -= this.direction[1] * this.speed * 2;
            }
        }
        
    }


    function Box(gs) {
        this.type = t_box;
        this.x = 300;
        this.y = 300;
        this.direction = [0, 0];
        this.speed = 2;


        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            if (this.x < 0)
                this.x = WIDTH;
            else if (this.x > WIDTH)
                this.x = 0;
            if (this.y < 0)
                this.y = HEIGHT;
            if (this.y > HEIGHT)
                this.y = 0;
        }

        this.draw = function(c) {
            c.fillStyle = 'rgba(50, 50, 50, 0.5)';
            c.beginPath();
            c.rect(this.x, this.y, pic, pic);
            c.closePath();
            c.fill();
        }

        this.get_collision_aabb = function () {
            return [this.x, this.y, pic, pic];
        }

        this.collide_aabb = function(who) {
            if (who.type == t_pusher) {
                if (this.direction[0] == 0 && this.direction[1] == 0)
                    this.direction = who.direction;
                
            }
        }

    }


    function World(gs) {


        var pusher = new Pusher(gs);
        var boxes = [];  

        this.init = function(gs) {
            gs.addEntity(pusher);
            boxes.push(gs.addEntity(new Box(gs)));
        }

        this.draw = function() {
            gs.clear();
            gs.background('rgba(255, 255, 255, 1.0)');
        }
        
        this.update = function() {

            collide.aabb([pusher], boxes);
        }
    }



    gs.addEntity(new World(gs));

}


function launch() {
    // use the DIV tag with Id of 'surface' as our game surface
    var gs = new JSGameSoup(document.getElementById("surface"), 30);

    main(gs);
    //gs.addEntity(new World(gs));
    //gs.addEntity(new Pusher(gs));
    //gs.addEntity(new Box(gs));
    // launch the game
    gs.launch();
}


