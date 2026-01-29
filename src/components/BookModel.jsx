import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, ContactShadows } from "@react-three/drei";

function Model(props) {
  const { scene } = useGLTF("/magic_book.glb");
  const ref = useRef();

  // Auto-rotate the car smoothly
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003; // Smooth rotation speed
    }
  });

  return <primitive object={scene} ref={ref} {...props} />;
}

const BookWidget = () => {
  return (
    <div className="w-full h-full relative bg-transparent pointer-events-none"> {/* pointer-events-none disables all user interaction */}
      
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 50, position: [0, 2, 8] }} // Moved camera back (z: 8) so the car isn't cut off
        gl={{ alpha: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Simple ambient light to ensure visibility */}
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        {/* Stage sets up the environment but we remove controls */}
        <Stage environment="city" intensity={0.5} contactShadow={false} adjustCamera={1.2}>
            <Model scale={0.01} />
        </Stage>

        {/* Dynamic Shadow */}
        <ContactShadows 
          opacity={0.7} 
          scale={12} 
          blur={2.5} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />
      </Canvas>
    </div>
  );
};

export default BookWidget;