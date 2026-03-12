import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Car() {
  return (
    <mesh rotation={[0.2, 0.5, 0]}>
      <boxGeometry args={[3, 1, 1.5]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
  );
}

export default function CarScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Car />
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}
