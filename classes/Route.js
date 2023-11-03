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
    sceneController;

    constructor(sceneController, routeName) {
        this.sceneController = sceneController;
        this.stations = Routes.routes[routeName];
        this.#setVectors();
    }

    #setVectors() {
        this.#leftTrainVector = new THREE.Vector3(
            this.stations[0]['vector']['x'] - 5,
            this.stations[0]['vector']['y'] - 1,
            this.stations[0]['vector']['z'] - 6.8,
        );

        // this.#rightTrainVector = new THREE.Vector3(
        //     this.stations[this.stations.length-1]['vector']['x'] - 5,
        //     this.stations[this.stations.length-1]['vector']['y'] - 1,
        //     this.stations[this.stations.length-1]['vector']['z'],
        // );
    }

    async render() {
        await this.#renderStations();
        await this.#renderTunnels();
        await this.#renderMetros();
    }

    async #renderStations() {
        const station = new Station(this.sceneController, this.stations[0]['vector']);

        for (let i = 0; i < this.stations.length; i++) {
            if (i === 0) {
                await station.render(this.sceneController.getScene());
                continue;
        }

            await station.clone(this.sceneController.getScene(), new Station(
                this.sceneController,
                this.stations[i]['vector'],
                // this.stations[i]['rotation']
            ));
        }
    }

    async #renderMetros() {
        this.leftCarriage = await (new Metro(this.#leftTrainVector, this.stations[0]['rotation'], this.sceneController.getSoundController(), this.sceneController.getUser(), false)).render(this.sceneController.getScene());
        // this.rightCarriage = await this.leftCarriage.clone(this.sceneController.getScene(), new Metro(this.#rightTrainVector, this.stations[this.stations.length-1]['rotation'], this.sceneController.getSoundController(), this.sceneController.getUser(), true));

        this.leftCarriage.driveRoute(this.stations);
        // this.rightCarriage.driveRoute(this.stations.reverse());
    }

    animateMetros() {
        if (this.leftCarriage.getMixer()) {
            this.leftCarriage.getMixer().update(0.006);
        }

        // if (this.rightCarriage.getMixer() != null) {
        //     this.rightCarriage.getMixer().update(0.006);
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
                    await tunnel.render(this.sceneController.getScene());
                    continue;
                }
                await tunnel.clone(this.sceneController.getScene(),
                    new Tunnel(new THREE.Vector3((startingValue + (y * lengthOfTunnel)) * direction, this.stations[i]['vector']['y'], this.stations[i]['vector']['z']-3.4)));
            }


        }
    }

}