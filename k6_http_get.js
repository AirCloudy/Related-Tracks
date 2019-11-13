import http from "k6/http";
import { check, sleep } from "k6";

let desiredRPS = 100;

let RPSperVU = 1;

let VUsRequired = Math.round(desiredRPS/RPSperVU);

const SONG_MAX_COUNT = 10000000;

export let options = {
    vus: VUsRequired,
    duration: "1m"
}

let baseUrl = 'http://localhost:5000'

export default function() {
    let iterationStart = new Date().getTime();
    let songId = Math.floor(Math.random() * SONG_MAX_COUNT) + 1;

    for (let i of Array(RPSperVU).keys()) {
        http.get(`${baseUrl}/${songId}`)
    }
    
    let iterationDuration = (new Date().getTime() - iterationStart) / 1000;
    let sleepTime = 1 - iterationDuration;

    if (sleepTime > 0) {
        sleep(sleepTime);
    }
}