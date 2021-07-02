# Orthobot

A simple game engine using Javascript modules in a way that avoids the need for any third party dependencies or compilers.

## Instructions

Open the index.html file in a browser via a localhost.

## Plan

* Like paradroid
* Level built from blocks
* Transfered as string of characters
* Character is tile or npc
* Player can grapple and shoot
* Tap is shoot.
* Hold extrudes grapple.
* Take over npc with grapple
* Take over takes quick mini game
* Bigger Npc has advantage 
* Maybe no mini game but hostage is just bigger meat shield
* Npc have rock/paper/scissor properties
* Npc have light cone restricting vision
* Obstacles have rock/paper/scissor properties
* Objective is place bombs or steal data's
* After last objective exit opens but npc's on alert
* Add perspective foreshortening factor to overlap and compress y positions globally. 
* Tiles closer to camera will overlap those further away slightly.
* When tethering player is anchored.
* Thetered bots are reeled in. The reeling has to be a minigame or button mash struggle to avoid idle time.
* Movement input perpendicular to the tether direction breaks the link
* Bigger bots reel slower 
* Tethered bots shoot at player, who is very vulnerable 
* Damage is inflicted on a health pool with constant regen with an elemental advantage/disadvantage.
* Tether is like arm in bionic commando. Or the inflator in dig dug
* Cute version: frog in a bee suit
* Unrender offscreen objects
* Use webassembly for calculations

## Controllers

Gamepad API
https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

## Sound

Web Audio API
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

## Assets

MagicaVoxel
https://ephtracy.github.io/

## License

[The MIT License](LICENSE)
