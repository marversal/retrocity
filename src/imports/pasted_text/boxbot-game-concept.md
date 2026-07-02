Create a retro-futuristic 2D pixel art video game called BOXBOT using sprite-based graphics inspired by 1980s military computer terminals, monochrome hacker interfaces, MS-DOS dashboards, LCD displays, and classic pixel-art factory games.

This project will be created in Figma Make, exported to GitHub, and deployed to Vercel.

I will manually provide all sprite sheets, PNG images, videos, and assets inside Figma Make.

Do not invent additional gameplay, mechanics, UI, styling, code, or features beyond what is described below.

ART STYLE

Use Sprite-Based / Pixel Art only.

Everything should be built using flat 2D pixel sprites.

Do not use:

3D rendering
GLB models
Three.js
WebGL
Perspective cameras
Raycasting
Physics engines

The game should resemble a polished 1980s monochrome military terminal mixed with a classic 16-bit factory simulation.

Visual inspiration

monochrome CRT terminal
military command console
hacker dashboard
retro factory simulation
LCD information display
pixel-art cyberpunk interface
COLOR PALETTE

Background

#000900

Primary Green

#39FF14

White

#FFFFFF

Use only neon green monochrome graphics on a nearly black background.

GAME FLOOR

Replace the workshop floor with a black background featuring an 8-bit neon green grid floor.

Requirements

glowing green grid lines
pixel-art style
perspective grid extending into the distance
monochrome CRT appearance
no textures
no gradients other than subtle CRT glow

The grid floor should remain visible throughout gameplay.

FONT

Use

VT323

for every interface element.

TOP TERMINAL BAR

Replace all existing text with

BOXBOT GRID // DATA MAP // DRONES ACTIVE // DATA LOADED : 0000000 MB

Display using neon green text.

HEALTH METER

Do not display the Health Meter at the beginning of the game.

Only after the dogs are deployed, add a Health Meter to the top terminal bar.

Requirements

neon green LCD style
terminal appearance
pixel-art UI
simple segmented health bar
starts at full health
updates when dogs touch the player
MAIN SCREEN

Display a pixel-art isometric city block.

The map contains exactly 5 buildings.

Everything should be created from pixel-art sprites.

No vector graphics.

No 3D models.

Each building represents one data center.

BUILDINGS

Create exactly five buildings.

Small

STACK NODE
ACTIVE

Medium

DATA HUB

Large

JAMMER

Extra Large

UPLINK

Tower

BLOCKCHAIN
BUILDING LAYOUT

Arrange the buildings in an isometric city block.

The center building is tallest.

Remaining buildings decrease naturally in height moving outward.

BUILDING DETAILS

Each building contains

glowing pixel windows
rooftop antenna
blinking beacon
neon green outlines
monochrome CRT lighting

Window locations remain fixed.

CRT EFFECTS

Apply subtle

scanlines
CRT flicker
monitor glow
vignette

Keep effects minimal.

MAP ANIMATIONS

Continuously animate

rooftop beacon blinking
vertical data scan lights
terminal flicker
BUILDING INTERACTION

Clicking any building

highlights the building
opens a left-side information panel

No additional functionality.

STACK NODE ROLLOVER

Hover over

STACK NODE

Open a floating black HUD window.

Automatically play

BOXBOT_splash.mp4

Below the video place one centered neon green button.

Button text

PLAY

No additional controls.

PLAY BUTTON

Clicking PLAY closes the city map and opens gameplay.

GAMEPLAY

Create a monochrome pixel-art robotic workshop using sprite graphics only.

Everything remains black and neon green.

The floor is the glowing 8-bit grid.

WORKSPACE LAYOUT

Center

BOT-512.png

Robot standing while holding a glowing white cube.

Lower Left

conveyor-512.png

Animated conveyor continuously scrolling.

Left Side

arm-512.png

Robot arm repeatedly malfunctions.

Lower Right

printer-512.png

Printer continuously produces glowing white cubes.

ROBOT ANIMATION

The robot continuously

walks
grabs cube
carries cube
places cube onto conveyor

Loop forever.

PRINTER

Continuously creates glowing white cubes.

Robot retrieves each cube.

CONVEYOR

Moves continuously.

Robot places cubes onto conveyor.

Cube spacing

5–8 pixels.

TIMER

Display a simple neon green timer.

Timer begins immediately when gameplay starts.

Measures stacking speed.

DRONE EVENT

After exactly three cubes appear on the conveyor

If the robot takes too long

Spawn

drone-512.png

The drone flies into the workshop.

The drone circles the player once.

After circling the player, display a small neon green terminal message above the drone.

Display exactly

REPORT:
SEND OUT 2 DOGS
DOG EVENT

Immediately after the drone finishes its report

Spawn exactly

2 × dog-512.png

The dogs enter the workshop from opposite sides of the screen.

Both dogs continuously chase the player.

Simple sprite walking animation.

When either dog touches the player

reduce the Health Meter
briefly flash the player sprite
continue chasing

No additional combat mechanics.

No weapons.

No attacks.

Only contact damage.

HEALTH

The Health Meter only appears after the dogs are deployed.

Each dog collision removes health.

Display health as a segmented neon-green LCD bar inside the top terminal bar.

USER INTERFACE

Maintain the monochrome terminal aesthetic throughout the game.

Use

black HUD panels
neon green outlines
VT323 font
pixel graphics
CRT scanlines
monochrome LCD styling
ASSETS I WILL PROVIDE

Video

BOXBOT_splash.mp4

Sprite Images

BOT-512.png

conveyor-512.png

arm-512.png

printer-512.png

drone-512.png

dog-512.png

I will manually import all assets into Figma Make.

Do not generate placeholders.

DEVELOPMENT REQUIREMENTS

Keep the project simple and beginner-friendly.

Organize the project into four screens.

Terminal Map
Building Selection
Video Preview
Gameplay

Keep all logic easy to understand inside Figma Make.

IMPORTANT

Build only what is described above.

Do not add

3D graphics
GLB models
physics engines
inventory
scoreboards
achievements
experience points
particle systems
sound effects
shaders
extra menus
additional buildings
additional enemies
extra gameplay systems
UI beyond what is requested
mechanics not specifically described

The finished project should feel like a polished 1980s monochrome pixel-art cyber terminal game, featuring a retro command interface, a glowing 8-bit grid workshop, sprite-based robot automation, a drone alert sequence, two enemy dogs that chase the player, and a simple LCD health meter integrated into the terminal interface.