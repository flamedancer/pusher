function World(gs) {

    this.draw = function() {
        gs.clear();
        gs.background('rgba(255, 255, 255, 1.0)');
    }
}

function launch() {
    // use the DIV tag with Id of 'surface' as our game surface
    var gs = new JSGameSoup(document.getElementById("surface"), 30);
    // add an instance of the 'Dot' entity class above to our game
    gs.addEntity(new World(gs));
    gs.addEntity(new Pusher(gs));
    // launch the game
    gs.launch();
}

function Pusher(gs) {
    this.x = 40;
    this.y = 40;
    this.speed = 10;

    this.update = function() {
    }
    

    this.draw = function(c) {
        c.fillStyle = 'rgba(200, 200, 200, 0.5)';
        c.beginPath();
        c.rect(0, 0, 60, 60);
        c.closePath();
        c.fill();
    }

    

}
