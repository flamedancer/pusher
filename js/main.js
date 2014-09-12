function World(gs) {

    this.draw = function() {
        gs.clear();
        gs.background('rgba(200, 200, 200, 1.0)');
    }
}

function launch() {
    // use the DIV tag with Id of 'surface' as our game surface
    var gs = new JSGameSoup("surface", 30);
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
    this.poly = [ [0, 0], [80, 80], [80, 0] ]; 
    


    this.draw = function(c) {
        c.strokeStyle = 'rgba(255, 255, 255, 1.0)';
        gs.polygon(this.poly);
    }

    

}
