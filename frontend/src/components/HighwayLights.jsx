import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HighwayLights() {
  const linesRef = useRef();

  useFrame(() => {
    linesRef.current.position.z += 0.2;
    if (linesRef.current.position.z > 5) {
      linesRef.current.position.z = -20;
    }
  });

  return (
    <group ref={linesRef} position={[0, -2, -20]}>
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 3, 0, i * -2]}>
          <boxGeometry args={[0.1, 0.02, 1]} />
          <meshStandardMaterial color="#00c6ff" emissive="#00c6ff" />
        </mesh>
      ))}
    </group>
  );
}
