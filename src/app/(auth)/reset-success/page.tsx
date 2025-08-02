import React from "react";
import {  ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CongratulationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Glow effect background */}
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/30 rounded-full shadow-2xl shadow-cyan-500 backdrop-blur-3xl blur-xl"></div>
            {/* Outer light circle with enhanced shadow */}
            <div className="relative w-48 h-48 bg-white/80 rounded-full shadow-2xl shadow-gray-300/60 flex items-center justify-center">
              {/* Inner dark circle with checkmark */}
              {/* <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-inner">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div> */}
              <Image
                src="/icons/PasswordUnlocked.gif"
                alt="404 Error Animation"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Congratulation Text */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Congratulation
        </h1>

        {/* Description Text */}
        <p className="text-gray-500 text-base leading-relaxed mb-8 px-4">
          Your details have been successfully reset your password.
        </p>

        {/* Next Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-primary/80 hover:bg-primary text-white px-8 py-3 rounded-lg font-medium  transition-colors duration-200"
        >
          Login now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
