import {color} from "../config/index.js";
import * as THREE from 'three';

export class Cone {
    constructor(scene, top, height) {
        this.scene = scene
        this.top = top
        this.height = height

        this.createCone({
            color: color.cone,
            height: 60,
            opacity: 0.8,
            top: 4.0,
            position: {
                x: 0,
                y: 50,
                z: 0
            }
        })
    }

    createCone(options) {
        const geometry = new THREE.ConeGeometry(15, 30, 4)

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_height: this.height,
                u_opacity: {
                    value: options.opacity
                },
                u_top: this.top,
            },
            transparent: true,
            vertexShader: `
                uniform float u_height;
                uniform float u_top;
                
                void main() {
                    float f_angle = u_height / 10.0;
                    float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
                    float new_y = position.y;
                    float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
                    vec4 v_position = vec4(new_x,new_y + u_top,new_z,1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * v_position;
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                uniform float u_opacity;
                void main() {
                    gl_FragColor = vec4(u_color,u_opacity*u_opacity);
                }
            `,
            depthTest: false
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(options.position)
        mesh.rotateZ(Math.PI)
        this.scene.add(mesh)
    }
}
