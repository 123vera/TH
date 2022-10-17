import React, { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // 导入轨道控制器JS库


const Person = function () {
    let domRef = useRef()
    let lights = useRef([]).current; // 创建 lights 空数组

    let width = window.innerWidth / 2; //窗口宽度
    let height = window.innerHeight / 2; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象

    // "yellow"=> array(0xFFFF00), 黄色
    // "blue"=> array(0x0000FF), 蓝色
    // "fuchsia"=> array(0xFF00FF), 紫红
    // "aqua"=> array(0x00FFFF), 浅绿色
    // "white"=> array(0xFFFFFF), 白色

    // 球体
    let sphereMesh = (R, x, y, z, color) => {
        let geometry = new THREE.SphereGeometry(R, 50, 50)
        var material = new THREE.MeshPhongMaterial({
            color: color || 0x0000ff
        });

        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z);
        return mesh
    }

    // 圆柱体
    let cylinderMesh = (R, h, x, y, z, color) => {
        let geometry = new THREE.CylinderGeometry(R, R, h, 50, 50)
        var material = new THREE.MeshPhongMaterial({
            color: color // 0x0000ff
        }); //材质对象Material

        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z);
        return mesh
    }

    const initMesh = () => {
        // 头部网格模型和组
        var headMesh = sphereMesh(40, 0, 0, 0, 0xFFFF00);
        headMesh.name = "脑壳"
        var leftEyeMesh = sphereMesh(10, 16, 16, 30, 0xFFFFFF);
        leftEyeMesh.name = "左眼"
        var rightEyeMesh = sphereMesh(10, -16, 16, 30, 0xFFFFFF);
        rightEyeMesh.name = "右眼"
        var headGroup = new THREE.Group();
        headGroup.name = "头部"
        headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);


        // 身体网格模型和组
        var neckMesh = cylinderMesh(20, 30, 0, -40, 0, 0x0000FF);
        neckMesh.name = "脖子"
        var bodyMesh = cylinderMesh(50, 80, 0, -90, 0);
        bodyMesh.name = "腹部"

        var leftArmMesh = cylinderMesh(12, 60, -62, -80, 0, 0xFF00FF);
        leftArmMesh.name = "左胳膊"
        var rightArmMesh = cylinderMesh(12, 60, 62, -80, 0, 0xFF00FF);
        rightArmMesh.name = "右胳膊"
        var armGroup = new THREE.Group();
        armGroup.name = "胳膊"
        armGroup.add(leftArmMesh, rightArmMesh);

        var leftLegMesh = cylinderMesh(12, 80, -30, -160, 0, 0xFF00FF);
        leftLegMesh.name = "左腿"
        var rightLegMesh = cylinderMesh(12, 80, 30, -160, 0, 0xFF00FF);
        rightLegMesh.name = "右腿"
        var legGroup = new THREE.Group();
        legGroup.name = "腿"
        legGroup.add(leftLegMesh, rightLegMesh);
        var bodyGroup = new THREE.Group();
        bodyGroup.name = "身体"
        bodyGroup.add(neckMesh, bodyMesh, legGroup, armGroup);


        // 人Group
        var personGroup = new THREE.Group();
        personGroup.name = "人"
        personGroup.add(headGroup, bodyGroup)
        personGroup.translateY(100)
        scene.add(personGroup);


        scene.traverse(function (obj) {
            if (obj.type === "Group") {
                console.log(obj.name);
            }
            // if (obj.type === "Mesh") {
            //     console.log('  ' + obj.name);
            //     obj.material.color.set(0xffff00);
            // }
            // if (obj.name === "左眼" | obj.name === "右眼") {
            //     obj.material.color.set(0xFFFFFF)
            // }
            // 打印id属性
            console.log(obj.id);
            // 打印该对象的父对象
            console.log(obj.parent);
            // 打印该对象的子对象
            console.log(obj.children);
        })

    }


    const initAmbient = useCallback(() => {
        // 太阳光
        const dirLight = new THREE.DirectionalLight("#fff", 0.5);
        dirLight.position.set(100, 200, 200);

        // 环境光
        const ambientLight = new THREE.AmbientLight(0x444444);

        // 点光源
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0, 0, 150); //点光源位置

        scene.add(pointLight, ambientLight); // 将灯光添加到场景中
        lights.push(pointLight, ambientLight);
    }, [])


    const initControls = useCallback(() => {
        controls.enableDamping = true; // 是否有惯性
        controls.enableZoom = true; // 是否可以缩放
        controls.autoRotate = true; // 是否自动旋转
        controls.autoRotateSpeed = 2; // 设置自动旋转速度
        controls.enablePan = true; // 是否开启右键拖拽
    }, []);


    const initRenderer = useCallback(() => {
        renderer.setPixelRatio(window.devicePixelRatio); // 设置分辨率为当前设备的分辨率，解决场景模糊，抗锯齿的一种很好的方法
        renderer.setSize(window.innerWidth, window.innerHeight); // 设置画布大小
        renderer.shadowMap.enabled = true; // 开启渲染阴影效果
        domRef.current.appendChild(renderer.domElement)
    }, [renderer, domRef])

    const initAxis = useCallback(() => {
        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        var axisHelper = new THREE.AxesHelper(350);
        scene.add(axisHelper);
    }, [])

    const initCamera = useCallback(() => {
        camera.aspect = window.innerWidth / window.innerHeight; // 设置场景的宽高比
        camera.for = 45;
        camera.far = 1000;
        camera.near = 1;
        camera.position.set(0, -50, 100)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix(); // 更新相机
    }, [camera])


    const initFn = () => {
        initMesh()
        initCamera()
        initAmbient()
        initRenderer()
        initControls()
        initAxis()
        function render() {
            renderer.render(scene, camera);//执行渲染操作
            requestAnimationFrame(render);//请求再次执行渲染函数render
        }
        render();
    }

    useEffect(() => {
        initFn()
    }, [])

    return (
        <div>
            <div ref={domRef}></div>
        </div>
    )
}

export default Person