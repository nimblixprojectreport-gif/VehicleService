import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import HighwayLights from './HighwayLights';
import CarModel from './CarModel';

export default function AuthBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas camera={{ position: [0, 2, 8] }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#00c6ff" />
        <Stars radius={80} depth={50} count={2000} factor={4} fade />
        <CarModel />
        <HighwayLights />
      </Canvas>
    </div>
  );
}
