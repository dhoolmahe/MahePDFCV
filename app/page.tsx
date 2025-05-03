"use client";

import dynamic from "next/dynamic";
import React from "react";

const PDFViewer = dynamic(() => import("../components/PDFViewer"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl shadow-lg bg-white rounded-xl p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">My CV</h1>
        <PDFViewer />
      </div>
    </div>
  );
}
