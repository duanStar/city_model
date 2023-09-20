import * as THREE from 'three'
import {Points} from "./points.js";

export class Snow {
    constructor(scene) {
        return new Points(scene, {
            range: 1000,
            count: 600,
            url: '/city_model/assets/snow.png',
            size: 30,
            setAnimation(item) {
                item.x -= item.speedX
                item.y -= item.speedY
                item.z -= item.speedZ
                if (item.y <= 0) {
                    item.y = this.range / 2
                }
            },
            setPosition(position) {
                position.speedX = Math.random() - 0.5
                position.speedY = Math.random() + 0.4
                position.speedZ = Math.random() - 0.5
            }
        })
    }
}
