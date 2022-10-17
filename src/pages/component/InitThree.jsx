import * as THREE from 'three'

export const initRenderer = (renderer, domRef) => {
    renderer.setPixelRatio(window.devicePixelRatio); // 设置分辨率为当前设备的分辨率，解决场景模糊，抗锯齿的一种很好的方法
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置画布大小
    renderer.shadowMap.enabled = true; // 开启渲染阴影效果
    domRef.current.appendChild(renderer.domElement)
}
// }, [renderer, domRef])

export const initControls = (controls) => {
    controls.enableDamping = true; // 是否有惯性
    controls.enableZoom = true; // 是否可以缩放
    controls.autoRotate = true; // 是否自动旋转
    controls.autoRotateSpeed = 2; // 设置自动旋转速度
    controls.enablePan = true; // 是否开启右键拖拽
}

export const initAxis = (scene) => {
    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    var axisHelper = new THREE.AxesHelper(500);
    scene.add(axisHelper);
}

export const initCamera = (camera) => {
    camera.aspect = window.innerWidth / window.innerHeight; // 设置场景的宽高比
    camera.for = 45;
    camera.far = 1000;
    camera.near = 1;
    camera.position.set(200, 300, 200)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix(); // 更新相机
}

export const initAmbient = (scene) => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight); // 将灯光添加到场景中
}
