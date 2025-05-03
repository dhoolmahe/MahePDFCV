"use client";

import { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer() {
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderAllPages = async () => {
      try {
        const loadingTask = getDocument("/cv.pdf");
        const pdf = await loadingTask.promise;

        if (cancelled || !containerRef.current) return;

        setNumPages(pdf.numPages);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = "mb-4 shadow rounded border";

          await page.render({
            canvasContext: context!,
            viewport,
          }).promise;

          containerRef.current.appendChild(canvas);
        }
      } catch (err) {
        console.error("Failed to render PDF:", err);
      }
    };

    renderAllPages();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // const handleDownload = () => {
  //   const link = document.createElement("a");
  //   link.href = "/cv.pdf"; // from public folder
  //   link.download = "MahendranVisvanathan-CV.pdf";
  //   link.click();
  // };

  const handleDownload = () => {
    const token = process.env.NEXT_PUBLIC_CV_DOWNLOAD_TOKEN;
    window.open(`/api/download-cv?token=${token}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={handleDownload}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition">
          📥 Download PDF
        </button>
      </div>
      <br></br>
      {/* PDF Viewer Container */}
      <div
        ref={containerRef}
        className="w-full max-w-3xl space-y-6 bg-white p-6 rounded-xl shadow-lg border"
      />
    </div>
  );
}
