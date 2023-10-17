import THREE from "three";

export class SoundController {

    listener;
    sound;
    audioLoader = new THREE.AudioLoader();

    constructor(listener) {
        this.listener = listener;
        this.sound = new THREE.Audio( listener );
    }


    playSound(pathToSoundFile) {
        const sound = new THREE.Audio( this.listener );

        this.audioLoader.load( pathToSoundFile, function( buffer, sound ) {
            sound.setBuffer( buffer );
            sound.setLoop( false );
            sound.setVolume( 0.5 );
            sound.play();
        });
    }

}