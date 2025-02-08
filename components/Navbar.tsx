"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, Upload } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [uploading, setUploading] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const { filename } = await uploadResponse.json();

      localStorage.setItem("lastUploadedModel", filename);
      window.location.href = "/gardens"; // Redirect to gardens page
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Babylon</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActive("/") ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`}>
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link href="/gardens" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActive("/gardens") ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`}>
              <Image size={18} />
              <span>Gardens</span>
            </Link>

            <div className="relative">
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
