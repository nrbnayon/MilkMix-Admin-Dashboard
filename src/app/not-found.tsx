"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const CreativeNotFound = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Don't render dynamic content until mounted to avoid hydration issues
  const parallaxStyle = mounted
    ? {
        transform: `translate(${mousePosition.x * 20}px, ${
          mousePosition.y * 20
        }px)`,
      }
    : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Elements */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                ...parallaxStyle,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 404 GIF */}
        <div className="mb-8 relative">
          <div className="relative w-1 h-64 md:w-80 md:h-80">
            <Image
              src="/icons/404.gif"
              alt="404 Error Animation"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          {/* Glowing effect behind GIF */}
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl scale-75 animate-pulse"></div>
        </div>

        {/* Error Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Oops!
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-300">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8 leading-relaxed">
          The page you&lsquo;re looking for doesn&lsquo;t exist or has been
          moved. Let&lsquo;s get you back on track!
        </p>

        {/* Quick Navigation */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-medium mb-4">Quick Navigation</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "Home", href: "/" },
                { name: "Contact", href: "/contact" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/5 transition-all duration-300 hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 text-center">
          <p className="text-purple-300/80 text-sm">
            💡 Did you know? The first 404 error was at CERN in 1992!
          </p>
        </div>
      </div>

      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default CreativeNotFound;
