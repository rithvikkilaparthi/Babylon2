"use client";
import { useRef, useState, useEffect } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { Loader2, Plus, Minus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Upload } from "lucide-react";

interface BabylonViewerProps {
  modelName?: string;
}

export default function BabylonViewer({ modelName }: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);
  const [camera, setCamera] = useState<BABYLON.ArcRotateCamera | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (engineRef.current) engineRef.current.dispose();

    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;
    const newScene = new BABYLON.Scene(engine);
    setScene(newScene);

    const newCamera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 15, new BABYLON.Vector3(0, 2, 0), newScene);
    newCamera.attachControl(canvasRef.current, true);
    setCamera(newCamera);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), newScene);
    light.intensity = 1.5;

    // Load model if provided
    if (modelName) {
      setLoading(true);
      BABYLON.SceneLoader.ImportMesh("", `/models/${modelName}.glb`, "", newScene, (meshes) => {
        meshes.forEach((mesh) => {
          mesh.position = new BABYLON.Vector3(0, 0, 0);
          mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
        });
        setLoading(false);
      }, undefined, (scene, message, exception) => {
        console.error("Error loading model:", message, exception);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    engine.runRenderLoop(() => newScene.render());
    window.addEventListener("resize", () => engine.resize());
    return () => engine.dispose();
  }, [modelName]);

  const moveCamera = (direction: 'forward' | 'backward' | 'left' | 'right') => {
    if (!camera) return;
    const moveDistance = 50;
    const forward = camera.getTarget().subtract(camera.position);
    forward.y = 0;
    forward.normalize();
    const left = BABYLON.Vector3.Cross(forward, BABYLON.Vector3.Up()).normalize();
    let movement = BABYLON.Vector3.Zero();
    switch (direction) {
      case 'forward': movement = forward.scale(moveDistance); break;
      case 'backward': movement = forward.scale(-moveDistance); break;
      case 'left': movement = left.scale(moveDistance); break;
      case 'right': movement = left.scale(-moveDistance); break;
    }
    camera.position.addInPlace(movement);
    camera.target.addInPlace(movement);
  };

  const zoomIn = () => { if (camera) camera.radius -= 50; };
  const zoomOut = () => { if (camera) camera.radius += 50; };

  const handlePlyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !scene) return;

    setLoading(true);

    try {
      const fileUrl = URL.createObjectURL(file);

      // Remove old models from scene
      scene.meshes.forEach((mesh) => {
        if (mesh.name !== "ground" && !mesh.name.includes("light")) {
          mesh.dispose();
        }
      });

      // Load PLY file
      BABYLON.SceneLoader.ImportMesh(
        "",
        "",
        fileUrl,
        scene,
        (meshes) => {
          console.log("PLY loaded successfully", meshes);

          // Center model in scene
          const rootMesh = meshes[0];
          const boundingBox = rootMesh.getBoundingInfo().boundingBox;
          const center = boundingBox.centerWorld;
          rootMesh.position = new BABYLON.Vector3(-center.x, -center.y, -center.z);

          // Adjust camera to fit model
          if (camera) {
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.alpha = Math.PI / 2;
            camera.beta = Math.PI / 3;

            const diagonal = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld).length();
            camera.radius = diagonal * 1.5;
          }

          setLoading(false);
        },
        (progressEvent) => {
          console.log("Loading progress: ", progressEvent);
        },
        (error) => {
          console.error("Error loading PLY:", error);
          setLoading(false);
        },
        ".ply"
      );
    } catch (error) {
      console.error("Error during upload:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf1]">
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="text-xl font-bold text-gray-900">3D Viewer</div>
        <input
          type="file"
          accept=".ply"
          onChange={handlePlyUpload}
          className="hidden"
          id="ply-upload"
        />
        <label
          htmlFor="ply-upload"
          className="px-4 py-2 text-white bg-black rounded-lg cursor-pointer flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload
        </label>
      </nav>
      <div className="flex-grow flex items-center justify-center bg-gray-100 relative">
        {loading && <Loader2 className="w-12 h-12 animate-spin text-gray-700" />}
        <canvas ref={canvasRef} className="w-full h-full" />

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={zoomIn} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"><Plus /></button>
          <button onClick={zoomOut} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"><Minus /></button>
        </div>

        {/* Movement Controls */}
        <div className="absolute bottom-20 right-4 grid grid-cols-3 gap-2">
          <div></div>
          <button onClick={() => moveCamera('forward')} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
            <ArrowUp className="w-5 h-5" />
          </button>
          <div></div>
          <button onClick={() => moveCamera('left')} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => moveCamera('backward')} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
            <ArrowDown className="w-5 h-5" />
          </button>
          <button onClick={() => moveCamera('right')} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
