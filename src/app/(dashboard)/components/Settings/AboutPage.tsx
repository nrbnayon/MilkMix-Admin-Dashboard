import React from "react";
import { Info, ExternalLink, Github, Twitter } from "lucide-react";
import Image from "next/image";
import Lordicon from "@/components/lordicon/lordicon-wrapper";

export default function AboutPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Info className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">About</h3>
          <p className="text-gray-600">Application information and details</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* App Info */}
        <div className="border border-primary/30 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-full flex justify-center items-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={120}
                height={120}
                className="w-[100px] h-[100px] md:w-[200px] md:h-[200px]"
              />
            </div>
            <p className="text-gray-600">Version 1.0.0</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Build Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-mono text-muted-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build:</span>
                  <span className="font-mono text-muted-foreground">
                    #2025.08.01
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-mono text-muted-foreground">
                    Production
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tech Stack</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frontend:</span>
                  <span className="text-muted-foreground">
                    Next.js latest, React Native latest
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Styling:</span>
                  <span className="text-muted-foreground">Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Icons:</span>
                  <span className="text-muted-foreground">Lucide React</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Features */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Modern UI/UX</h5>
                <p className="text-sm text-gray-600">
                  Clean, responsive design with dark mode support
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Real-time Updates</h5>
                <p className="text-sm text-gray-600">
                  Live notifications and data synchronization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Secure & Private</h5>
                <p className="text-sm text-gray-600">
                  End-to-end encryption and privacy protection
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Cross-platform</h5>
                <p className="text-sm text-gray-600">
                  Works seamlessly on all devices
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Links */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Links & Resources
          </h4>
          <div className="space-y-3">
            <a
              href="https://github.com/nrbnayon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Documentation</span>
              </div>
              <span className="text-gray-500">→</span>
            </a>

            <a
              href="https://github.com/nrbnayon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Source Code</span>
              </div>
              <span className="text-gray-500">→</span>
            </a>

            <a
              href="https://github.com/nrbnayon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">
                  Follow Updates
                </span>
              </div>
              <span className="text-gray-500">→</span>
            </a>
          </div>
        </div>

        {/* Credits */}
        <div className="border border-primary/30 rounded-lg p-6">
          <div className="text-center">
            <Lordicon
              src="https://cdn.lordicon.com/ewmfucya.json"
              trigger="loop"
              colors={{
                primary: "#9ca3af",
                secondary: "#ff0000",
              }}
              size={50}
              stroke={3}
            />{" "}
            <p className="text-gray-600">
              Made with love by{" "}
              <span className="font-semibold text-gray-900">Nayon</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              © 2025 Your MilkMix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
