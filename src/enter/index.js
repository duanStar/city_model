import * as THREE from 'three'
import {City} from "./city.js";
import {onBeforeUnmount} from "vue";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export function initCity() {
    // 获取画布元素
    const canvas = document.querySelector('#webgl')

    // 创建场景
    const scene = new THREE.Scene()

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000)
    camera.position.set(1000, 500, 100)
    scene.add(camera)

    // 创建控件
    const controls = new OrbitControls(camera, canvas)
    // 允许拖动的惯性
    controls.enableDamping = true
    // 允许缩放
    controls.enableZoom = false
    controls.minDistance = 100
    controls.maxDistance = 2000
    // 允许右键拖动
    controls.enablePan = true;

    // 创建光源
    scene.add(new THREE.AmbientLight(0xadadad))
    const directLight = new THREE.DirectionalLight(0xffffff)
    directLight.position.set(0, 0, 0)
    directLight.castShadow = true
    scene.add(directLight)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        canvas
    })

    // 设置大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置背景色
    renderer.setClearColor(new THREE.Color(0x000000), 1)

    const clock = new THREE.Clock()

    const city = new City({
        scene,
        camera,
        renderer,
        controls
    })

    let animationFrame;
    const animate = () => {
        controls.update()
        city.start(clock.getDelta());
        renderer.render(scene, camera)
        animationFrame = requestAnimationFrame(animate)
    }
    animate();

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
    }

    window.addEventListener('resize', onResize)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animationFrame)
        animationFrame = null
    })

    return {
        scene,
        camera,
        renderer
    }
}
