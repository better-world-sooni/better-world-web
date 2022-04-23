import { WebGLRenderTarget, Object3D } from "three";
import React, { useRef, useMemo } from "react";
import { useLoader, useThree, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import lerp from "lerp";
import BackfaceMaterial from "./BackfaceMaterial.js";
import RefractionMaterial from "./RefractionMaterial.js";
import { useBlock } from "../blocks";
import state from "../../modules/store";

const dummy = new Object3D();
export default function Diamonds() {
	const gltf = useLoader(GLTFLoader, "/AstronautHelmet/scene.gltf");

	const { size, gl, scene, camera, clock } = useThree();
	const { contentMaxWidth, sectionHeight, mobile } = useBlock();
	const model = useRef(null);
	const ratio = gl.getPixelRatio();
	const geometry = gltf.__$[11].name === "Helmet-Body_Helmet-Body_0" ? gltf.__$[11].geometry : gltf.__$[10].geometry;

	const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
		const envFbo = new WebGLRenderTarget(size.width * ratio, size.height * ratio);
		const backfaceFbo = new WebGLRenderTarget(size.width * ratio, size.height * ratio);
		const backfaceMaterial = new BackfaceMaterial();
		const refractionMaterial = new RefractionMaterial({
			envMap: envFbo.texture,
			backfaceMap: backfaceFbo.texture,
			resolution: [size.width * ratio, size.height * ratio],
		});
		return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial];
	}, [size, ratio]);

	useFrame(() => {
		state.diamonds.forEach((data, i) => {
			const t = clock.getElapsedTime() / 2;
			const { x, offset, scale, factor } = data;
			const s = ((contentMaxWidth / 35) * scale) / 2;
			// @ts-ignore
			data.pos.set(mobile ? 0 : x, lerp(data.pos.y, -sectionHeight * offset * factor + (state.top.current / state.zoom) * factor, 0.1), 0);
			dummy.position.copy(data.pos);
			if (i === state.diamonds.length - 1) dummy.rotation.set(0, t, 0);
			else dummy.rotation.set(t, t, t);
			dummy.scale.set(s, s, s);
			dummy.updateMatrix();
			model.current.setMatrixAt(i, dummy.matrix);
			// const rotationOffset = Math.PI/2
			// if (i === state.diamonds.length - 1) dummy.rotation.set(0, t + rotationOffset, 0)
			// else dummy.rotation.set(t + rotationOffset, t, t )
			// dummy.updateMatrix()
			model.current.instanceMatrix.needsUpdate = true;
		});

		gl.autoClear = false;
		camera.layers.set(0);
		gl.setRenderTarget(envFbo);
		gl.clearColor();
		gl.render(scene, camera);
		gl.clearDepth();
		camera.layers.set(1);
		model.current.material = backfaceMaterial;
		// model1.current.material = backfaceMaterial
		gl.setRenderTarget(backfaceFbo);
		gl.clearDepth();
		gl.render(scene, camera);
		camera.layers.set(0);
		gl.setRenderTarget(null);
		gl.render(scene, camera);
		gl.clearDepth();
		camera.layers.set(1);
		model.current.material = refractionMaterial;
		// model1.current.material = refractionMaterial
		gl.render(scene, camera);
	}, 1);

	return (
		<instancedMesh ref={model} layers={1} args={[null, null, state.diamonds.length]} position={[0, 0, 0]}>
			<bufferGeometry attach="geometry" {...geometry} />
		</instancedMesh>
	);
}
