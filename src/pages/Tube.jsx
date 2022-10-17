
import React, { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // 导入轨道控制器JS库
import { initRenderer as IRenderer, initControls as IControls, initAxis as IAxis, initCamera as ICamera, initAmbient as IAmbient } from './component/InitThree'

const Tube = () => {
    let domRef = useRef()
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

    let renderer = new THREE.WebGLRenderer({ antialias: true }) // 是否抗锯齿
    let scene = new THREE.Scene()
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, -2000, 2000);
    var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象
    var material = new THREE.LineBasicMaterial({ color: 0x00FFFF });

    // 三维样条曲线  Catmull-Rom算法
    const initTube = () => {
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-60, 20, 90),
            new THREE.Vector3(-10, 40, 40),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(60, -60, 0),
            new THREE.Vector3(-40, -60, 40),
            new THREE.Vector3(-60, 20, 90),
        ]);
        let geometry = new THREE.TubeGeometry(curve, 40, 15, 15, true);
        var line = new THREE.Line(geometry, material); // 线条模型对象

        scene.add(line); //线条对象添加到场景中
    }


    let initAxis = useCallback(() => IAxis(scene), [])
    let initCamera = useCallback(() => ICamera(camera), [camera])
    let initRenderer = useCallback(() => IRenderer(renderer, domRef), [renderer, domRef])
    let initControls = useCallback(() => IControls(controls), [controls])
    let initAmbient = useCallback(() => IAmbient(scene), [])

    useEffect(() => {
        initTube()

        initAxis()
        initCamera()
        initRenderer()
        initControls()
        initAmbient()
        function render() {
            renderer.render(scene, camera);//执行渲染操作
            requestAnimationFrame(render);//请求再次执行渲染函数render
        }
        render();
    }, [])

    return (
        <div>
            <div ref={domRef}></div>
        </div>
    )
}
export default Tube