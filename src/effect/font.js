import * as THREE from 'three'
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";

export class Font {
    constructor(scene) {
        this.scene = scene
        this.font = null
        this.init()
    }

    init() {
        const loader = new FontLoader()
        loader.load('/font.json', font => {
            this.font = font

            this.createTextQueue()
        })
    }

    createTextQueue() {
        [
            {
                text: '最高的楼',
                size: 20,
                position: {
                    x: -10,
                    y: 130,
                    z: 410
                },
                rotate: Math.PI / 1.3,
                color: '#fff'
            },
            {
                text: '第二高的楼',
                size: 20,
                position: {
                    x: 180,
                    y: 110,
                    z: -70
                },
                rotate: Math.PI / 2,
                color: '#fff'
            }
        ].forEach(item => {
            this.createText(item)
        })
    }

    createText(option) {
        const geometry = new TextGeometry(option.text, {
            font: this.font,
            size: option.size,
            height: 2
        })

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(option.color)
                }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                void main() {
                    gl_FragColor = vec4(u_color,1.0);
                }
            `
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(option.position)
        mesh.rotateY(option.rotate)
        this.scene.add(mesh)
    }
}
