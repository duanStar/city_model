import {Points} from "./points.js";

export class Rain {
    constructor(scene) {
        return new Points(scene, {
            range: 2000,
            count: 800,
            url: '/assets/rain.png',
            size: 10,
            setAnimation(item) {
                item.y -= item.speedY
                if (item.y <= 0) {
                    item.y = this.range / 2
                }
            },
            setPosition(position) {
                position.speedY = 20
            }
        })
    }
}
