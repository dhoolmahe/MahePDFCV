"use client";

import dynamic from "next/dynamic";
import React from "react";

const PDFViewer = dynamic(() => import("../components/PDFViewer"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl shadow-lg bg-white rounded-xl p-6">
        {/* Professional Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            📄 Curriculum Vitae
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            A detailed summary of my professional background, skills, and
            experience.
          </p>
          <div className="mt-4 border-b border-gray-200 w-1/2 mx-auto" />
        </div>

        <PDFViewer />
      </div>
    </div>
  );
}
