import { useState, useEffect, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

const DistractionTracker = () => {
  const [distractions, setDistractions] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const lastFaceDetected = useRef(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await blazeface.load();
        detectFace();
      } catch (error) {
        console.error("AI Model Error:", error);
      }
    };

    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
        setCameraReady(true);
        const video = webcamRef.current.video;
        const predictions = await modelRef.current.estimateFaces(video, false);

        if (predictions.length === 0) {
          if (lastFaceDetected.current) {
            setDistractions((prev) => prev + 1);
            setIsFocused(false);
            lastFaceDetected.current = false;
          }
        } else {
          if (!lastFaceDetected.current) {
            setIsFocused(true);
            lastFaceDetected.current = true;
          }
        }
      }
      requestAnimationFrame(detectFace);
    };

    loadModel();
  }, []);

  return (
    <div className="relative w-full h-full bg-black flex flex-col justify-center items-center overflow-hidden">
      
      {/* Loading State */}
      {!cameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-[10px] text-slate-500 tracking-widest">INIT CAMERA...</p>
        </div>
      )}

      {/* Webcam Feed - Forces fill */}
      <Webcam
        ref={webcamRef}
        audio={false}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onUserMedia={() => setCameraReady(true)}
        videoConstraints={{ width: 200, height: 200, facingMode: "user" }}
      />
      
      {/* Status Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isFocused ? "text-emerald-400" : "text-rose-400"}`}>
             <div className={`w-1.5 h-1.5 rounded-full ${isFocused ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
             {isFocused ? "FOCUSED" : "DISTRACTED"}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
             #{distractions}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DistractionTracker;