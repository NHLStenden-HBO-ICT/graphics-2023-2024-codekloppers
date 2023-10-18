import * as THREE from "three";
import {Station} from "./3dModels/Station";
import {Metro} from "./3dModels/Metro";
import {Tunnel} from "./3dModels/Tunnel";
import {Routes} from "/config/routes"

export class Route {
    stations;
    #leftTrainVector;
    #rightTrainVector;
    leftCarriage;
    rightCarriage;

    constructor(sceneController, routeName) {
        this.sceneController = sceneController;
        this.stations = Routes.routes[routeName];
        this.setVectors();
    }

    setVectors() {
        this.#leftTrainVector = new THREE.Vector3(
            this.stations[0]['vector']['x'] - 5,
            this.stations[0]['vector']['y'] - 1,
            this.stations[0]['vector']['z'] - 6.8,
        );

        this.#rightTrainVector = new THREE.Vector3(
            this.stations[this.stations.length-1]['vector']['x'] - 5,
            this.stations[this.stations.length-1]['vector']['y'] - 1,
            this.stations[this.stations.length-1]['vector']['z'],
        );
    }

    async render() {
        await this.#renderStations();
        await this.#renderMetros();
        // await this.#renderTunnels();
    }

    async #renderStations() {
        const station = new Station(this.sceneController, this.stations[0]['vector']);

        for (let i = 0; i < this.stations.length; i++) {
            if (i === 0) {
                await station.render(this.sceneController.scene);
                // station.setBoundingBox(this.sceneController.scene);
                continue;
            }

            await station.clone(this.sceneController.scene, new Station(
                this.sceneController,
                this.stations[i]['vector'],
                // this.stations[i]['rotation']
            ));
        }
    }

    async #renderMetros() {
        this.leftCarriage = await (new Metro(this.#leftTrainVector, this.stations[0]['rotation'], this.sceneController.soundController)).render(this.sceneController.scene);
        this.rightCarriage = await this.leftCarriage.clone(this.sceneController.scene, new Metro(this.#rightTrainVector, this.stations[this.stations.length-1]['rotation'], this.sceneController.soundController));
        // this.leftCarriage._objectScene.add(this.sceneController.soundController.loadPositionalSound(this.leftCarriage))
        // this.leftCarriage.renderHeadLights(this.sceneController.scene, 1);
        // this.rightCarriage.renderHeadLights(this.sceneController.scene, 1);

        this.leftCarriage.driveRoute(this.stations, false);
        console.log('test');
        this.rightCarriage.driveRoute(this.stations.reverse(), true);

        // this.sceneController.soundController.loadSound('/assets/sound_effects/CloseUbahnDoors.mp3')
    }

    animateMetros() {
        if (this.leftCarriage.mixer) {
            this.leftCarriage.mixer.update(0.006);
        }

        // console.log(1);

        // if (this.leftCarriage.secondCarriage.mixer != null) {
        //     this.leftCarriage.secondCarriage.mixer.update(0.003);
        // }

        if (this.rightCarriage.mixer != null) {
            this.rightCarriage.mixer.update(0.006);
        }

        // if (this.rightCarriage.secondCarriage.mixer != null) {
        //     this.rightCarriage.secondCarriage.mixer.update(0.003);
        // }
    }

    async #renderTunnels() {
        let amountOfTunnels;
        let direction;
        let startingValue;
        let stationA
        let stationB
        let lengthOfTunnel = 10;

        for (let i = 0; i < this.stations.length; i++) {
            if (i === this.stations.length - 1) {
                return;
            }
            stationA = this.stations[i]['vector']['x'];
            stationB = this.stations[i + 1]['vector']['x'];

            amountOfTunnels = ((Math.abs(stationA - stationB) - 64 - 34) / 10) + 1;

            if (stationA > stationB) {
                startingValue = 64 - stationA;
                direction = -1;
            }

            if (stationA < stationB) {
                startingValue = 34 + stationA;
                direction = 1
            }

            const tunnel = new Tunnel(new THREE.Vector3(
                startingValue * direction,
                this.stations[i]['vector']['y'],
                this.stations[i]['vector']['z'] - 3.4
            ));

            for (let y = 0; y < amountOfTunnels; y++) {
                if (y === 0) {
                    await tunnel.render(this.sceneController.scene);
                    continue;
                }
                await tunnel.clone(this.sceneController.scene,
                    new Tunnel(new THREE.Vector3((startingValue + (y * lengthOfTunnel)) * direction, this.stations[i]['vector']['y'], this.stations[i]['vector']['z']-3.4)));
            }


        }
    }

}