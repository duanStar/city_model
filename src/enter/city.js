import {loadFBX} from "../utils/index.js";
import {SurroundLine} from "../effect/SurroundLine.js";
import {Background} from "../effect/background.js";
import * as THREE from 'three'
import Tween from "@tweenjs/tween.js";
import {Radar} from "../effect/radar.js";
import {Wall} from "../effect/wall.js";
import {Circle} from "../effect/circle.js";
import {Ball} from "../effect/ball.js";
import {Cone} from "../effect/Cone.js";
import {Fly} from "../effect/fly.js";
import {Road} from "../effect/road.js";
import {Font} from "../effect/font.js";
import {Snow} from "../effect/snow.js";
import {Rain} from "../effect/rain.js";
import {Smoke} from "../effect/smoke.js";

export class City {
    constructor({camera, scene, renderer, controls}) {
        this.camera = camera
        this.scene = scene
        this.renderer = renderer
        this.controls = controls
        this.tweenPosition = null
        this.tweenRotation = null
        this.height = {
            value: 5
        }
        this.top = {
            value: 0
        }
        this.flag = false
        this.time = {
            value: 0
        }
        this.effect = {}
        this.loadCity()
    }

    start(delta) {
        for (let key in this.effect) {
            if (this.effect[key].animation) {
                this.effect[key].animation()
            }
        }
        if (this.tweenPosition && this.tweenRotation) {
            this.tweenPosition.update()
            this.tweenRotation.update()
        }
        this.height.value += 0.4
        if (this.height.value > 160) {
            this.height.value = 5
        }
        this.time.value += delta

        if (this.top.value >= 15 || this.top.value <= 0) {
            this.flag = !this.flag
        }
        this.top.value += this.flag ? 0.8 : -0.8
    }

    initEffect() {
        new Background(this.scene)
        new Radar(this.scene, this.time)
        new Wall(this.scene, this.time)
        new Circle(this.scene, this.time)
        new Ball(this.scene, this.time)
        new Cone(this.scene, this.top, this.height)
        new Fly(this.scene, this.time)
        new Road(this.scene, this.time)
        new Font(this.scene)
        // this.effect.snow = new Snow(this.scene)
        // this.effect.rain = new Rain(this.scene)
        this.effect.smoke = new Smoke(this.scene)
        this.addClick()
        this.addWheel()
    }

    loadCity() {
        loadFBX('../model/beijing.fbx').then(obj => {
            obj.traverse(child => {
                if (child.isMesh) {
                    // 自己创建mesh,便于控制
                    new SurroundLine({
                        scene: this.scene,
                        child,
                        height: this.height,
                        time: this.time
                    })
                }
            })
            this.initEffect()
        })
    }

    addClick() {
        let flag = true
        document.onmousedown = () => {
            flag = true
        }
        document.onmousemove = () => {
            flag = false
        }
        document.onmouseup = (e) => {
            if (flag) {
                this.clickEvent(e)
            }
        }
    }

    clickEvent(e) {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = -(e.clientY / window.innerHeight) * 2 + 1

        // 创建设备坐标
        const standardVector = new THREE.Vector3(x, y, 0.5)

        // 创建世界坐标
        const worldVector = standardVector.unproject(this.camera)

        // 实现选中
        // 发射射线
        const ray = worldVector.sub(this.camera.position).normalize()

        const raycaster = new THREE.Raycaster(this.camera.position, ray)

        // 返回射线碰撞到的物体
        const intersects = raycaster.intersectObjects(this.scene.children, true)
        let point3d = null
        if (intersects.length) {
            point3d = intersects[0]
        }
        if (point3d) {
            const proportion = 3
            const time = 1000
            this.tweenPosition = new Tween.Tween(this.camera.position).to({
                x: point3d.point.x * proportion,
                y: point3d.point.y * proportion,
                z: point3d.point.z * proportion
            }, time).start()
            this.tweenRotation = new Tween.Tween(this.camera.rotation).to({
                x: this.camera.rotation.x,
                y: this.camera.rotation.y,
                z: this.camera.rotation.z
            }, time).start()
        }
    }

    addWheel() {
        document.body.onmousewheel = e => {
            const value = 30
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1

            const vector = new THREE.Vector3(x, y, 0.5)
            vector.unproject(this.camera)
            vector.sub(this.camera.position).normalize()

            if (e.wheelDelta > 0) {
                this.camera.position.x += vector.x * value
                this.camera.position.y += vector.y * value
                this.camera.position.z += vector.z * value

                this.controls.target.x += vector.x * value
                this.controls.target.y += vector.y * value
                this.controls.target.z += vector.z * value
            } else {
                this.camera.position.x -= vector.x * value
                this.camera.position.y -= vector.y * value
                this.camera.position.z -= vector.z * value

                this.controls.target.x -= vector.x * value
                this.controls.target.y -= vector.y * value
                this.controls.target.z -= vector.z * value
            }
        }
    }
}
