import { useEffect, useState, useCallback, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // 导入轨道控制器JS库

function Box() {
    let domRef = useRef()
    let lights = useRef([]).current; // 创建 lights 空数组

    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

    let scene = new THREE.Scene()
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    let renderer = new THREE.WebGLRenderer({ antialias: true }) // 是否抗锯齿
    var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象

    var geometry = new THREE.SphereGeometry(60, 40, 40);  //创建一个立方体几何对象Geometry
    // var geometry = new THREE.BoxGeometry(100, 100, 100);  //创建一个立方体几何对象Geometry
    // var geometry = new THREE.OctahedronGeometry(50); // 
    var geometryLine = new THREE.Line3({
        color: 0xff0000 //线条颜色
    });

    // 材质对象
    var material = new THREE.MeshNormalMaterial(); //材质对象Material
    var materialPoint = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 5.0 //点对象像素尺寸
    });
    var materialLine = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });

    // var material = new THREE.MeshLambertMaterial({
    //   color: 0x0000ff,
    //   opacity: 0.5,
    //   transparent: true
    // });//材质对象


    useEffect(() => {
        initThree()
    }, [])

    const initThree = () => {
        initCamera()
        initRenderer()
        initMesh()
        initAmbient()
        initControls()
        initAxis()
        function render() {
            renderer.render(scene, camera);//执行渲染操作
            requestAnimationFrame(render);//请求再次执行渲染函数render
        }
        render();
        // controls.addEventListener('mousedown', onDocumentMouseDown, false);
        // controls.addEventListener("mousewheel", onDocumentMouseWheel, false);
        // controls.addEventListener("keydown", onDocumentKeyDown, false);
        // controls.addEventListener('resize', onWindowResize, false);


        // controls.addEventListener('change', render);//监听鼠标、键盘事件
    }


    const initAxis = useCallback(() => {
        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        var axisHelper = new THREE.AxesHelper(250);
        scene.add(axisHelper);
    }, [])

    const initControls = useCallback(() => {
        controls.enableDamping = true; // 是否有惯性
        controls.enableZoom = true; // 是否可以缩放
        controls.autoRotate = true; // 是否自动旋转
        controls.autoRotateSpeed = 2; // 设置自动旋转速度
        controls.enablePan = true; // 是否开启右键拖拽
    }, []);


    const initCamera = useCallback(() => {
        camera.aspect = window.innerWidth / window.innerHeight; // 设置场景的宽高比
        camera.for = 45;
        camera.far = 1000;
        camera.near = 1;
        camera.position.set(0, 10, 100)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix(); // 更新相机
    }, [camera])


    const initRenderer = useCallback(() => {
        renderer.setPixelRatio(window.devicePixelRatio); // 设置分辨率为当前设备的分辨率，解决场景模糊，抗锯齿的一种很好的方法
        renderer.setSize(window.innerWidth, window.innerHeight); // 设置画布大小
        renderer.shadowMap.enabled = true; // 开启渲染阴影效果
        domRef.current.appendChild(renderer.domElement)
    }, [renderer, domRef])


    const initMesh = useCallback(() => {
        // var lines = new THREE.Line3(geometryLine, materialLine); // 、线模型
        // lines.translateX(150)
        // var points = new THREE.Points(geometry, material); // 点模型
        var mesh = new THREE.Mesh(geometry, material); //网格模型 - 对象Mesh

        scene.add(mesh); //网格模型添加到场景中
    }, [])


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


    return (
        <div className="box" >
            <div ref={domRef}></div>
        </div>
    )
}

export default Box
