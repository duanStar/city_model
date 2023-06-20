import * as THREE from 'three'

export class Points {
    constructor(scene, {range, count, setPosition, setAnimation, url, size}) {
        this.scene = scene
        this.range = range
        this.count = count
        this.setPosition = setPosition
        this.setAnimation = setAnimation
        this.pointList = []
        this.url = url
        this.size = size
        this.init()
    }

    init() {
        this.material = new THREE.PointsMaterial({
            size: this.size,
            map: new THREE.TextureLoader().load(this.url),
            transparent: true,
            opacity: 0.8,
            depthTest: false
        })

        this.geometry = new THREE.BufferGeometry()

        for (let i = 0; i < this.count; i++) {
            const position = new THREE.Vector3(Math.random() * this.range - this.range / 2, Math.random() * this.range, Math.random() * this.range - this.range / 2)
            this.setPosition(position)
            this.pointList.push(position)
        }
        this.geometry.setFromPoints(this.pointList)

        this.mesh = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    animation() {
        this.pointList.forEach(item => {
            this.setAnimation(item)
        })
        this.mesh.geometry.setFromPoints(this.pointList)
    }
}
