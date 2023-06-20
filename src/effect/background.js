import * as THREE from 'three'

export class Background {
    constructor(scene) {
        this.scene = scene
        this.url = 'src/assets/white-bg.png'
        this.init()
    }

    init() {
        const loader = new THREE.TextureLoader()
        const geometry = new THREE.SphereGeometry(5000, 32, 32)
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: loader.load(this.url)
        })

        const sphere = new THREE.Mesh(geometry, material)

        sphere.position.set(0, 0, 0)
        this.scene.add(sphere)
    }
}
