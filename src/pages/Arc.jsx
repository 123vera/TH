import React, { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // 导入轨道控制器JS库

const Arc = () => {
    let domRef = useRef()
    var width = window.innerWidth / 2; //窗口宽度
    var height = window.innerHeight / 2; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

    let renderer = new THREE.WebGLRenderer({ antialias: true }) // 是否抗锯齿
    let scene = new THREE.Scene()
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, -2000, 2000);
    var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象
    let geometry = new THREE.BufferGeometry(); //  THREE.Geometry 已废弃

    //   方法一
    // let arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
    // let points = arc.getPoints(50);//分段数50，返回51个顶点

    // 方法二
    var R = 100; //圆弧半径
    var N = 50; //分段数量
    let points = new Array()
    for (var i = 0; i < N; i++) {
        var angle = 2 * Math.PI / N * i;
        var x = R * Math.sin(angle);
        var y = R * Math.cos(angle);
        points.push(new THREE.Vector3(x, y, 0));
    }
    points.push(points[0]); // 插入第一个订单，使圆弧闭合




    geometry.setFromPoints(points);  // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices

    let material = new THREE.LineBasicMaterial({ color: 0xffffff });
    let line = new THREE.Line(geometry, material);
    scene.add(line)

    const initRenderer = useCallback(() => {
        renderer.setPixelRatio(window.devicePixelRatio); // 设置分辨率为当前设备的分辨率，解决场景模糊，抗锯齿的一种很好的方法
        renderer.setSize(window.innerWidth, window.innerHeight); // 设置画布大小
        renderer.shadowMap.enabled = true; // 开启渲染阴影效果
        domRef.current.appendChild(renderer.domElement)
    }, [renderer, domRef])

    const initControls = useCallback(() => {
        controls.enableDamping = true; // 是否有惯性
        controls.enableZoom = true; // 是否可以缩放
        controls.autoRotate = true; // 是否自动旋转
        controls.autoRotateSpeed = 2; // 设置自动旋转速度
        controls.enablePan = true; // 是否开启右键拖拽
    }, []);

    const initAxis = useCallback(() => {
        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        var axisHelper = new THREE.AxesHelper(500);
        scene.add(axisHelper);
    }, [])

    const initCamera = useCallback(() => {
        camera.aspect = window.innerWidth / window.innerHeight; // 设置场景的宽高比
        camera.for = 45;
        camera.far = 1000;
        camera.near = 1;
        camera.position.set(200, 300, 200)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix(); // 更新相机
    }, [camera])

    const initAmbient = useCallback(() => {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff);

        scene.add(ambientLight); // 将灯光添加到场景中
    }, [])

    useEffect(() => {
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

export default Arc