import * as THREE from "three";

export class SoundController {

    listener;
    audioLoader = new THREE.AudioLoader();

    constructor(listener) {
        this.listener = listener;
    }


    loadSound(pathToSoundFile, duration = undefined) {
        const sound = new THREE.Audio( this.listener );

        this.audioLoader.load( pathToSoundFile, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( false );
            sound.duration = duration;
            sound.setVolume( 0.5 );
            // sound.play();
        });
        return sound;
    }

    loadPositionalSound(pathToSoundFile, duration = undefined) {
        const sound = new THREE.PositionalAudio(this.listener);

        this.audioLoader.load(pathToSoundFile, function (buffer) {
            sound.duration = duration;
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setRefDistance(20)
            sound.setVolume(0.5);
            sound.play()
        });

        return sound;
    }
}