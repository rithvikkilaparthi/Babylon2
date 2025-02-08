"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { Loader2 } from "lucide-react";

interface UploadPlyProps {
  scene: BABYLON.Scene | null;
  camera: BABYLON.ArcRotateCamera | null;
}

export interface UploadPlyHandle {
  handlePlyUpload: (file: File) => void;
}

const UploadPly = forwardRef<UploadPlyHandle, UploadPlyProps>(({ scene, camera }, ref) => {
  const [loading, setLoading] = useState(false);

  const handlePlyUpload = async (file: File) => {
    if (!file || !scene) {
      console.log("No file selected or scene not ready");
      return;
    }

    setLoading(true);

    try {
      const fileUrl = URL.createObjectURL(file);

      // Clear existing meshes except ground and lights
      scene.meshes.forEach((mesh) => {
        if (mesh.name !== "ground" && !mesh.name.includes("light")) {
          mesh.dispose();
        }
      });

      // Load the PLY file using Babylon's PLY loader
      BABYLON.SceneLoader.ImportMesh(
        "",
        "",
        fileUrl,
        scene,
        (meshes) => {
          // Successfully loaded the PLY
          console.log("PLY loaded successfully", meshes);

          // Center the model
          const rootMesh = meshes[0];
          const boundingBox = rootMesh.getBoundingInfo().boundingBox;
          const center = boundingBox.centerWorld;

          // Adjust position to center
          rootMesh.position = new BABYLON.Vector3(-center.x, -center.y, -center.z);

          // Adjust camera to focus on the model
          if (camera) {
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.alpha = Math.PI / 2;
            camera.beta = Math.PI / 3;

            // Set camera radius based on model size
            const diagonal = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld).length();
            camera.radius = diagonal * 1.5;
          }

          setLoading(false);
        },
        (progressEvent) => {
          // Loading progress
          console.log("Loading progress: ", progressEvent);
        },
        (error) => {
          // Error handling
          console.error("Error loading PLY:", error);
          setLoading(false);
        },
        ".ply" // Explicitly specify the file extension
      );
    } catch (error) {
      console.error("Error during upload:", error);
      setLoading(false);
    }
  };

  // Expose the handlePlyUpload function to the parent component
  useImperativeHandle(ref, () => ({
    handlePlyUpload,
  }));

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-100 relative">
      {loading && <Loader2 className="w-12 h-12 animate-spin text-gray-700" />}
    </div>
  );
});

export default UploadPly;