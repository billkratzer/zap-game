# Welcome to Zap!

Zap is an action-puzzle game that you can play in your web browser.
The game is inspired by [Zoop](https://en.wikipedia.org/wiki/Zoop) , a game that I played in the mid-90's on my PC.

![Zopp action shot](https://upload.wikimedia.org/wikipedia/en/3/3d/MD_Zoop_%28Stage_4%29.png "Zoop in Action!")

# How the Game is Played

You control a triangle-shaped piece in the middle sqare of the Zoop game board.   Pieces of different colors (orange, blue, green and purple) will start to slowly populate around the edges of the board.  Eventually, as new pieces populate the edges, they will push other pieces toward the center.

Your goal is to keep those pieces from enter your square in the center of the board!  The longer you play, the more points you can score.  The game is over when pieces push into your 4 by 4 square area.

Pieces can be removed because you can fire shots at the pieces.
However, not every show will destroy pieces.
You can only destroy pieces that are the same color as your player piece.
For example, if you player piece is green, you can only shoot at (and destroy) green pieces.
When you fire at a piece that is NOT the same color as your ship, you swap colors with the piece.

For example:  If you are colored green, and you shoot at 3 green pieces in a row, you will destroy all of those pieces.
If the piece behind that is blue, then that piece will turn green (and not be destroyed), but your ship will turn blue (allowing you to destroy blue pieces!)

As time presses on, pieces are added to the board at a faster and faster pace, until the pieces finally invade your square in the middle of the screen, ending the game.

In the original version of the game, there are some additionally pieces, including a bomb-like piece that destroys all pieces touching the bomb when fired.   There is also a piece that destroy all pieces in a single line.

# Where to play the game

The game can be played on my [web-site](https://zap.thekratzers.com/zap-game)

# Installing the Game

This code can be downloaded right from gitlab and served off a local web server.

# Game design

## Overview

This section is to document ideas about the design and implementation of the game.

The idea of this project is not to simply make a Zoom clone.
This project is meant to be a homage to the original game, while exploring ideas to make the game play more fun and engaging.

This project is also an homage to what is possible with modern Javascript game libraries like [Phaser](https://phaser.io).

Finally, this project is just a labor of love for me, and an opportunity to build something cool and fun with my very talented friends!

## Controls

The initial iteration of the game will use keyboard controls.

* Arrow keys and *ASDF* keys will be used to move your player piece around the board
* The space bar will be used to fire
* The *Escape* key will be used to pause the game
* The *Delete* key will be used to quit the game

## Initial feature set

The initial version of this game will attempt to recreate the basic aspects of the game, including:

* Four-different colored pieces
* A board with the game size and dimensions of the original
* Progressively faster levels
* Special pieces like the bomb and lightening bolt

The initial working version of the game will simply use the sprite sheet for the game, until real art-work can be put in place.

The scoring system is not the interesting to me.  If I can figure out the original scoring logic, I will initially implement it.

I will make no attempt to recreate the original music, sound effects, or the original pacing of the game.  I really think that these are ideas that can be improved upon once the initial game is in place.

## Improvement ideas

### Art Work

While I love and adore the original art-work for Zoop.  I feel like Zap could benefit from fresh design ideas.

The first major improvement will feature higher resolution graphics.  The original game was implement using 16x16 pixel images.  Today, we can do a lot better!

I think this game could sport all sorts of cool, quirk themes.

Some ideas include:

* An homage to the original theme, with newer high resolution graphics.
* A minimal theme
* A dark-theme
* A spooky theme
* A playful, space like theme
* A LEGO theme
* etc, etc, etc

### Game Play

There are many new game mechanics that could be introduced to add some new challenging play elements, including:

* More than four colors - maybe introducing a fifth or sixth color in higher levels
* Pieces that may need to be hit multiple times by different colors (for example:  a blue/green piece that needs to be hit once by blue and once by green)
* Powerful power-ups that destory all pieces of a single color or all pieces in an entire quadrant
* Pieces that are curses and do things like
    * make the game go faster temporarily
    * introduce a fog of war
    * reverses the keys (argh!)
    * mud which makes you move slower
* Other play elements could include:
    * earthquakes (that shake the screen's cameras)
    * lighting and rain that make it hard to see or concentrate
    * a board that temporarily enlarges to 2x or 3x size
    * multi-player!

# Project Layout

This game is built using [Phaser 3](https://phaser.io)!

The **/art** directory contains all design assets for this project.

The **/src** directory contains the source code and production assets for this project.  In a nutshell, you will deploy the **src** directory tree to a web server!

The **/src/assets** directory contains fonts, images, sounds, music files that are used by the game.

The **/css** directory contains any css used by the containing *index.html* page

The **/js** directory contains the logic, code, and libraries for the game.

The file **src/index.html** is the main, hosting page.

The file **src/js/main.js** is the main code starting point.

