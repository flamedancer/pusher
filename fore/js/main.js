function main(gs) {
    /*** Define some different types of things ***/
    t_pusher = 1;
    t_box = 2;
    t_ai = 3;

    WIDTH = gs.width;
    HEIGHT = gs.height;

    pic = 30;

    boxes = [];  
    Ai_pushers = [];  

    box_num = 20;
    Ai_num = 8;


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


    function Ai_pusher(x, y) {
        this.type = t_ai;
        
        this.x = x * pic;
        this.y = y * pic;
        this.speed = 4;

        var all_directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        this.direction = all_directions[Math.floor(Math.random() * 4)]

        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            if (this.x < 0)
                this.x = WIDTH;
            else if (this.x > WIDTH)
                this.x = 0;
            else if (this.y < 0)
                this.y = HEIGHT;
            else if (this.y > HEIGHT)
                this.y = 0;

            // 1/5的概率 自动换方向
            if (Math.random() <= 0.05) {
                var all_directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                this.direction = all_directions[Math.floor(Math.random() * 4)]
            }
        }
        

        this.draw = function(c) {
            c.fillStyle = 'rgba(50, 40, 20, 1.0)';
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
                if (who.direction[0] == 0 && who.direction[1] == 0) {
                    this.direction = [ -this.direction[0], -this.direction[1]]
                    this.x += this.direction[0] * this.speed;
                    this.y += this.direction[1] * this.speed;
                }
                else {
                    this.destroy();
                    who.destroy();
                }
            }
        }

        this.destroy = function(c) {
            this.x = -100;
            this.y = -100;
            gs.delEntity(this);
        }
        
       

    }


    function Box(x, y) {
        this.type = t_box;
        this.x = x * pic;
        this.y = y * pic;
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

        this.destroy = function(c) {
            this.x = -100;
            this.y = -100;
            gs.delEntity(this);
        }
    }


    function World(gs) {


        var pusher = new Pusher(gs);

        this.init = function(gs) {
            gs.addEntity(pusher);
            for (var n=0; n<box_num; n++) {
                var locat = Math.floor(Math.random() * 200) 
                boxes.push(gs.addEntity(new Box(locat / 10, locat % 10)));
            }

            for (var n=0; n<Ai_num; n++) {
                var locat = Math.floor(Math.random() * 200) 
                Ai_pushers.push(gs.addEntity(new Ai_pusher(locat / 10, locat % 10)));
            }
        }

        this.draw = function() {
            gs.clear();
            gs.background('rgba(255, 255, 255, 1.0)');
        }
        
        this.update = function() {

            collide.aabb([pusher], boxes);
            collide.aabb(Ai_pushers, boxes);
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


