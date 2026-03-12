import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function CarModel() {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[3, 0.7, 1.5]} />
      <meshStandardMaterial color="#1f2937" wireframe />
    </mesh>
  );
}
