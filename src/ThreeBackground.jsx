import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Stars, Sparkles } from '@react-three/drei';

const Particle = (props) => {
    const mesh = useRef();

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
            <mesh ref={mesh} {...props}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color="#0ea5e9" opacity={0.6} transparent roughness={0.1} />
            </mesh>
        </Float>
    );
};

const Capsule = (props) => {
    const mesh = useRef();

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.z += 0.005;
            mesh.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={mesh} {...props}>
                <capsuleGeometry args={[0.3, 1, 4, 8]} />
                <meshPhysicalMaterial
                    color="#14b8a6"
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.5}
                    thickness={1}
                    opacity={0.8}
                    transparent
                />
            </mesh>
        </Float>
    );
};

const ThreeBackground = () => {
    const particleCount = 20;

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 10 - 5;
            temp.push({ position: [x, y, z], key: i });
        }
        return temp;
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#6366f1" />

                    {particles.map((p) => (
                        <Particle key={p.key} position={p.position} />
                    ))}

                    <Capsule position={[-3, 2, -2]} rotation={[Math.PI / 4, 0, 0]} />
                    <Capsule position={[3, -2, -3]} rotation={[-Math.PI / 4, 0, 0]} />
                    <Capsule position={[4, 3, -4]} rotation={[Math.PI / 2, 0, 0]} />

                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
