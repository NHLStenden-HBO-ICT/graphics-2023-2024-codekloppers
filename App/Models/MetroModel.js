import * as THREE from "three";

class MetroModel extends Model {
    constructor() {
        super();

    }

    openDoors_right(animations) {

        for (var i = 0; i < animations.length; i++) {
            var action = mixer.clipAction(animations[i], objects[0]);
            action.paused = false; // Hervat de animatie

            // Zorg ervoor dat de animatie in de juiste richting wordt afgespeeld (voorwaarts)
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce); // Bijvoorbeeld: speel de animatie slechts één keer
            action.clampWhenFinished = true; // Houd de animatie op het laatste frame wanneer deze is voltooid

            // Als de actie eindigt (completed) of als deze nog niet is gestart (uninitialized),
            // dan start de actie opnieuw.
            if (action._clip.tracks.length === 0 || action._clip.tracks[0].times[0] === 0) {
                action.reset();
            }
            action.play();
        }
    }

    closeDoors_right(animations) {

        for (var i = 0; i < animations.length; i++) {
            var action = mixer.clipAction(animations[i], objects[0]);
            action.paused = false; // Hervat de animatie

            // Speel de animatie in omgekeerde richting af door timeScale in te stellen op -1
            action.timeScale = -1;
            action.clampWhenFinished = true; // Houd de animatie op het laatste frame wanneer deze is voltooid
            action.setLoop(THREE.LoopOnce); // Bijvoorbeeld: speel de animatie slechts één keer
            // Voeg de actie toe aan de mixer
            action.play();
        }
    }
}