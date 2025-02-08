"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fdfaf1]">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Babylon</h1>
      <p className="mt-4 text-gray-700">Explore and create immersive 3D environments.</p>
      <button 
        onClick={() => router.push("/gardens")}
        className="mt-6 px-6 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition"
      >
        Get Started
      </button>
    </div>
  );
}
