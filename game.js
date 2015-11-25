/**
 * Created by javi on 25/11/15.
 */

//window.onload = function() {

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload () {

    game.load.image('logo', 'images/phaser.png');
    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('star', 'images/star.png');
    game.load.spritesheet('dude', 'images/dude.png', 32, 48);


}

var platforms;
var cursors;
var player;
var player2;

var score = 0;
var scoreText;

function create () {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0,'sky');

    platforms=game.add.group();
    platforms.enableBody=true;
    var ground= platforms.create(0,game.world.height -64, 'ground');
    ground.scale.setTo(2,2);

    ground.body.immovable=true;

    var ledge= platforms.create(200,400,'ground');
    ledge.body.immovable=true;
    ledge=platforms.create(-150,250,'ground');
    //ledge.body.immovable=true;

    player=createPlayer();

    cursors=game.input.keyboard.createCursorKeys();


    stars = game.add.group();

    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 200;
        star.body.velocity.x=-50+Math.random() *100;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
        star.body.bounce.x = 0.7 + Math.random() * 0.2;
    }

    scoreText = game.add.text(16, 16, 'score: 0  position.x= '+ player.body.x, { fontSize: '32px', fill: '#000' });

}

function createPlayer(){
    p= game.add.sprite(200, game.world.height -650, 'dude');

    game.physics.arcade.enable(p);

    p.body.bounce.y = 0.2;
    p.body.bounce.x = 1;
    p.body.gravity.y = 300;
    p.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    p.animations.add('left', [0, 1, 2, 3], 10, true);
    p.animations.add('right', [5, 6, 7, 8], 10, true);

    return p;

}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(platforms, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(stars, stars);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    if (player2) {
        game.physics.arcade.collide(player,player2);
        game.physics.arcade.collide(player2, platforms);

    }


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -350;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 350;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    if (!player2 && cursors.down.isDown)
    {
        player2=createPlayer();
    }


}

function setPosition(x){
    if(player){
        console.log('setting position.x to ' +x );
        player.position.x=x;

    }

}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score +'  position.x= '+ player.body.x;

}



//    };

