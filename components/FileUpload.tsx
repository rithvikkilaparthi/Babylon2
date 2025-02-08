import { useState } from "react";
import axios from "axios";

interface FileUploadProps {
  setModelPath: (path: string) => void;
}

export default function FileUpload({ setModelPath }: FileUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const uploadFiles = async () => {
    if (!files) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.model_path) {
        setModelPath(res.data.model_path);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload & Generate 3D Model</button>
    </div>
  );
}
