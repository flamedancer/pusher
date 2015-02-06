t_pusher = 1;
t_box = 2;
t_ai = 3;
pic = 50;
Ai_num = 8;
player_speed = 6;
box_speed = 12;


function main(gs) {
    /*** Define some different types of things ***/
    WIDTH = gs.width;
    HEIGHT = gs.height;

    boxes = [];
    Ai_pushers = [];

    all_locate = [];
    
    pusher = new Pusher(0);

    pusher2 = new Pusher2(0);


    var s = new WebSocket("ws://127.0.0.1:9091/foobar/");
    s.onopen = function() {
    //alert("connected !!!");
        s.send('{"c":"w"}');   // begin  command
    };

    function Pusher(locate) {
        this.type = t_pusher;
        this.x = 0;
        this.y = 0;

        this.speed = player_speed;

        this.direction = [0, 0];

        this.set_pic_locate = function(locate) {
            this.x = parseInt(locate / 20) * pic;
            this.y = (locate % 20) * pic;
        };

        this.set_pic_locate(locate);

        this.set_uid = function(id) {
            this.uid = id;
        };

        this.get_locate = function(x, y) {
            return [this.x, this.y];
        };

        this.set_locate = function(x, y) {
            this.x = x;
            this.y = y;
        };

        this.keyHeld_40 = this.keyDown_40 = function(){
            s.send('{"c":"d"}');
        };

        this.keyHeld_37 = this.keyDown_37 = function(){
            s.send('{"c":"l"}');
            //this.go_left();
        };

        this.keyHeld_38 = this.keyDown_38 = function(){
            s.send('{"c":"u"}');
            //this.go_up();
        };

        this.keyHeld_39 = this.keyDown_39 = function(){
            s.send('{"c":"r"}');
            //this.go_right();
        };

        this.keyUp_37 = this.keyUp_38 = this.keyUp_39 = this.keyUp_40 = function () {
            s.send('{"c":"s"}');
            //this.direction = [0, 0];
        };

        this.go_down = function() {
            this.direction = [0, 1];
        };

        this.go_left = function() {
            this.direction = [-1, 0];
        };

        this.go_up = function() {
            this.direction = [0, -1];
        };

        this.go_right = function() {
            this.direction = [1, 0];
        };

        this.stop = function() {
            this.direction = [0, 0];
        };

        var sync_flag = 0;
        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            for (var b in boxes) {
                var be = boxes[b];
                if (this != be && collide.collide_aabb_no_side_entities(this, be) && !isNaN(be.x)) {
                    if (be.direction[0] === 0 && be.direction[1] === 0) {
                        be.collide_aabb_no_side(this);
                        this.x -= this.direction[0] * this.speed;
                        this.y -= this.direction[1] * this.speed;
                        this.direction = [0, 0];
                        return;
                    }
                    else
                        this.destroy();
                }
            }
            
            if (this.x < 0)
                this.x = 0;
            else if (this.x + pic > WIDTH)
                this.x = this.x - this.speed;
            else if (this.y < 0)
                this.y = 0;
            else if (this.y + pic > HEIGHT)
                this.y = this.y - this.speed;

            sync_flag = sync_flag - 1;
            if(sync_flag <= 0) {
                this.asyn();
                sync_flag = 60;
            }
        };
        
        this.draw = function(c) {
            c.fillStyle = 'rgba(200, 200, 200, 0.5)';
            c.beginPath();
            c.rect(this.x, this.y, pic, pic);
            c.closePath();
            c.fill();
        };

        this.get_collision_aabb = function() {
            return [this.x, this.y, pic, pic];
        };

        this.collide_aabb_no_side = function(who) {
            if (who.type == t_box) {
                if (who.direction[0] === 0 && who.direction[1] === 0) {
                    this.x -= this.direction[0] * this.speed;
                    this.y -= this.direction[1] * this.speed;
                }
                else {
                    //document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
                    document.getElementById("lose").style.display = "block";
                }
            }
        };

        this.destroy = function() {
            //document.getElementById("lose").style.paddingTop = gs.height / 2 - 100;
            game_lose();
        };

        this.asyn = function() {
            s.send('{"c":"sync","locate":[' + this.get_locate().toString() + ']}' );
        };
        
    }


    function Pusher2(locate) {
        this.type = t_pusher;
        
        this.speed = player_speed;
        this.direction = [0, 0];

        //var all_directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        //this.direction = all_directions[Math.floor(Math.random() * 4)]

        this.set_pic_locate = function(locate) {
            this.x = parseInt(locate / 20) * pic;
            this.y = (locate % 20) * pic;
        };

        this.set_pic_locate(locate);

        this.set_locate = function(x, y) {
            this.x = x;
            this.y = y;
        };

        this.set_uid = function(id) {
            this.uid = id;
        };

        this.go_down = function() {
            this.direction = [0, 1];
        };

        this.go_left = function() {
            this.direction = [-1, 0];
        };

        this.go_up = function() {
            this.direction = [0, -1];
        };

        this.go_right = function() {
            this.direction = [1, 0];
        };

        this.stop = function() {
            this.direction = [0, 0];
        };

        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            for (var b in boxes) {
                var be = boxes[b];
                if (this != be && collide.collide_aabb_no_side_entities(this, be) && !isNaN(be.x)) {
                    if (be.direction[0] === 0 && be.direction[1] === 0) {
                        be.collide_aabb_no_side(this);
                        this.x -= this.direction[0] * this.speed;
                        this.y -= this.direction[1] * this.speed;
                        this.direction = [0, 0];
                        return;
                    }
                    else
                        this.destroy();
                }
            }
            
            if (this.x < 0)
                this.x = 0;
            else if (this.x + pic > WIDTH)
                this.x = this.x - this.speed;
            else if (this.y < 0)
                this.y = 0;
            else if (this.y + pic > HEIGHT)
                this.y = this.y - this.speed;
        };
        
        this.draw = function(c) {
            c.fillStyle = 'rgba(200, 200, 200, 0.5)';
            c.beginPath();
            c.rect(this.x, this.y, pic, pic);
            c.closePath();
            c.fill();
        };

        this.get_collision_aabb = function() {
            return [this.x, this.y, pic, pic];
        };

        this.collide_aabb_no_side = function(who) {
            if (who.type == t_box) {
                if (who.direction[0] === 0 && who.direction[1] === 0) {
                    this.x -= this.direction[0] * this.speed;
                    this.y -= this.direction[1] * this.speed;
                }
                else {
                    //document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
                    document.getElementById("win").style.display = "block";
                }
            }
        };

        this.destroy = function() {
            //document.getElementById("gameover").style.paddingTop = gs.height / 2 - 100;
            game_win();
        };
      
    }


    function Box(id, locate) {
        this.type = t_box;
        this.direction = [0, 0];
        this.speed = box_speed;
        this.travel = 0;

        this.id = id;

        this.set_pic_locate = function(locate) {
            this.x = parseInt(locate / 20) * pic;
            this.y = (locate % 20) * pic;
        };

        this.set_pic_locate(locate);

        this.get_locate = function(x, y) {
            return [this.x, this.y];
        };

        this.set_locate = function(x, y) {
            this.x = x;
            this.y = y;
        };

        this.walk_back = function() {
            this.x -= this.direction[0] * this.speed;
            this.y -= this.direction[1] * this.speed;
        };

        var sync_flag = 0;
        this.update = function() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
            this.travel = this.travel + 1;
            for (var b in boxes) {
                var be = boxes[b];
                if (this != be && collide.collide_aabb_no_side_entities(this, be)) {
                    this.x -= this.direction[0] * this.speed;
                    this.y -= this.direction[1] * this.speed;
                    this.direction = [0, 0];
                    return;
                }
            }
            
            if (this.x < 0)
                this.x = WIDTH;
            else if (this.x > WIDTH)
                this.x = 0;
            if (this.y < 0)
                this.y = HEIGHT;
            if (this.y > HEIGHT)
                this.y = 0;
            if (this.travel >= 150)
                this.direction = [0, 0];

            sync_flag = sync_flag - 1;
            if(sync_flag <= 0) {
                this.asyn();
                sync_flag = 600;
            }
        };

        this.draw = function(c) {
            c.fillStyle = 'rgba(50, 50, 50, 0.5)';
            c.beginPath();
            c.rect(this.x, this.y, pic, pic);
            c.closePath();
            c.fill();

        };

        this.get_collision_aabb = function () {
            return [this.x, this.y, pic, pic];
        };

        this.collide_aabb_no_side = function(who) {
            if (who.type == t_pusher) {
                if (this.direction[0] === 0 && this.direction[1] === 0) {
                    this.direction = who.direction;
                    this.travel = 0;
                    for (var b in boxes) {
                        var be = boxes[b];
                        if (this != be &&collide.collide_aabb_no_side_entities(this, be)) {
                            this.direction = [0, 0];
                            break;
                        }
                    }
                }
                
            }
            else if (who.type == t_box) {
                if (who.direction[0] === 0 && who.direction[1] === 0 && !(this.direction[0] === 0 && this.direction[1] === 0)) {
                    this.walk_back();
                    this.direction = [0, 0];
                    who.direction = [0, 0];
                }
                else if (!(this.direction[0] === 0 && this.direction[1] === 0) && !(who.direction[0] === 0 && who.direction[1] === 0)) {
                    this.destroy();
                    who.destroy();
                }
            }
        };
        
        this.asyn = function() {
            s.send('{"c":"sync_box", "box_id":' + this.id.toString() + ',"box_locate":[' + this.get_locate().toString() + ']}' );
        };

        this.destroy = function(c) {
            this.x = -100;
            this.y = -100;
            gs.delEntity(this);
        };
    }


    function World(gs) {

        this.init_world = function(data) {
            
            if (pusher.uid == "pusher_1") {
                pusher.set_pic_locate(data.pusher_1);
                pusher2.set_pic_locate(data.pusher_2);
            }
            else {
                pusher.set_pic_locate(data.pusher_2);
                pusher2.set_pic_locate(data.pusher_1);
            }

            boxes_num = data.boxes.length;
            for (var a=0; a<boxes_num; a++) {
                var locate = data.boxes[a];
                boxes.push(gs.addEntity(new Box(a, locate)));
            }
            gs.addEntity(pusher);
            gs.addEntity(pusher2);
            
        };

        this.draw = function() {
            gs.clear();
            gs.background('rgba(255, 255, 255, 1.0)');
        };
        
        this.update = function() {

        };
    }
    

    world = gs.addEntity(new World(gs));


    s.onmessage = function(e) {
        var obj = eval ("(" + e.data + ")");
        var cmd = obj.c;
        var envoy;
        if (cmd == "w") {
            pusher.set_uid(obj.uid);
            return;
        }
        else if (cmd == "b") {  // begin game
            data = obj.data;
            world.init_world(data);
            game_start();
            return;
        }
        else if (cmd == 'sync_box') { // sync this box location
            var box_id = obj.box_id;
            var box_locate = obj.box_locate;
            boxes[box_id].set_locate(box_locate[0], box_locate[1]);
        }
        else if (cmd == 'disconnect') { // opponent disconnect
            game_win();
        }
        else {
            if (obj.uid == pusher.uid) {
                envoy = pusher;
            }
            else {
                envoy = pusher2;
            }
            switch (cmd) {
                case 'l':  // left
                    envoy.go_left();
                    break;
                case 'u':  // up
                    envoy.go_up();
                    break;
                case 'd':  // down
                    envoy.go_down();
                    break;
                case 'r':  // right 
                    envoy.go_right();
                    break;
                case 's':  // stop
                    envoy.stop();
                    break;
                case 'sync':  // sync oponent location
                    var locate = obj.locate;
                    envoy.set_locate(locate[0], locate[1]);
                    break;
            }
        }
    };
}

function game_start() {
    document.getElementById("wait").style.display = "none";
}

function game_win() {
    document.getElementById("win").style.display = "block";
}

function game_lose() {
    document.getElementById("lose").style.display = "block";
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


