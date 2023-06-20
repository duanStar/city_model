import {color} from "../config/index.js";
import * as THREE from 'three'

export class Fly {
    constructor(scene, time) {
        this.scene = scene
        this.time = time

        this.createFly({
            source: {
                x: 300,
                y: 0,
                z: -200
            },
            target: {
                x: -500,
                y: 0,
                z: -240
            },
            range: 200,
            height: 300,
            color: color.ball,
            size: 30
        })
        this.createFly({
            source: {
                x: 300,
                y: 0,
                z: 300
            },
            target: {
                x: -500,
                y: 0,
                z: -240
            },
            range: 200,
            height: 300,
            color: color.fly,
            size: 30
        })
    }

    createFly(options) {
        const source = new THREE.Vector3(options.source.x, options.source.y, options.source.z)
        const target = new THREE.Vector3(options.target.x, options.target.y, options.target.z)

        const center = target.clone().lerp(source, 0.5)
        center.y += options.height

        const len = parseInt(source.distanceTo(target))

        const curve = new THREE.QuadraticBezierCurve3(source, center, target)

        const points = curve.getPoints(len)

        const positions = []
        const aPositions = []
        points.forEach((item, index) => {
            positions.push(item.x, item.y, item.z)
            aPositions.push(index)
        })

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1))

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_time: this.time,
                u_range: {
                    value: options.range
                },
                u_size: {
                    value: options.size
                },
                u_total: {
                    value: len
                }
            },
            vertexShader: `
                attribute float a_position;
                uniform float u_time;
                uniform float u_range;
                uniform float u_total;
                uniform float u_size;
                varying float v_opacity;
                void main() {
                    float size = u_size;
                    float total_num = u_total * mod(u_time, 1.0);
                    if(total_num > a_position && total_num < a_position + u_range) {
                        float index = (a_position + u_range - total_num) / u_range;
                        size *= index;
                        v_opacity = 1.0;
                    }else {
                        v_opacity = 0.0;
                    }
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size / 10.0;
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                varying float v_opacity;
                void main() {
                    gl_FragColor = vec4(u_color, v_opacity);
                }
            `,
            transparent: true
        })
        const point = new THREE.Points(geometry, material)

        this.scene.add(point)
    }
}
