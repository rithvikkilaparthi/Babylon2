"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, Upload } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Babylon</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link
              href="/gardens"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/gardens')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Image size={18} />
              <span>Gardens</span>
            </Link>

            <Link
              href="/upload"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/upload')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Upload size={18} />
              <span>Upload</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 