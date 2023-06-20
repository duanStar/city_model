import * as THREE from 'three'

export class Smoke {
    constructor(scene) {
        this.scene = scene
        this.smokes = []
        this.init()
    }

    init() {
        this.geometry = new THREE.BufferGeometry()

        this.material = new THREE.PointsMaterial({
            size: 50,
            map: new THREE.TextureLoader().load('src/assets/smoke.png'),
            depthWrite: false,
            transparent: true
        })

        this.material.onBeforeCompile = function (shader) {
            const vertex1 = `
                attribute float a_opacity;
                attribute float a_scale;
                attribute float a_size;
                varying float v_opacity;
                
                void main() {
                    v_opacity = a_opacity;
            `
            const glPointSize = `
                gl_PointSize = a_size * a_scale;
            `
            shader.vertexShader = shader.vertexShader.replace('void main() {', vertex1)
            shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', glPointSize)

            const fragment1 = `
                varying float v_opacity;
                
                void main() {
            `
            const fragment2 = `
                gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
            `

            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment1)
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(outgoingLight, diffuseColor.a);', fragment2)
        }

        this.mesh = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update() {
        const positions = []
        const sizeList = []
        const scaleList = []
        const opacityList = []
        this.smokes = this.smokes.filter(item => {
            if (item.opacity < 0) {
                return false
            }
            item.opacity -= 0.01
            item.scale += 0.01
            item.x += item.speed.x
            item.y += item.speed.y
            item.z += item.speed.z
            positions.push(item.x, item.y, item.z)
            sizeList.push(item.size)
            opacityList.push(item.opacity)
            scaleList.push(item.scale)
            return true
        })
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
        this.geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(opacityList), 1))
        this.geometry.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(sizeList), 1))
        this.geometry.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array(scaleList), 1))
    }

    createSmoke() {
        this.smokes.push({
            size: 50,
            opacity: 1,
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            speed: {
                x: Math.random(),
                y: Math.random() + 0.3,
                z: Math.random()
            }
        })
    }

    animation() {
        this.createSmoke()
        this.update()
    }
}
