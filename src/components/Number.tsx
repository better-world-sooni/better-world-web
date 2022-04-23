import * as THREE from "three";
import React, { Suspense, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import lerp from "lerp";
import Text from "./Text";

export default function Number() {
	const ref = useRef(null);
	const { size, viewport } = useThree();
	return (
		<Suspense fallback={null}>
			<group ref={ref}>
				<Text size={2}>Gomz</Text>
			</group>
		</Suspense>
	);
}
