"use client";

import { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// Set the PDF.js worker path
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

          // Append canvas to container
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

  return (
    <div className="p-4 flex flex-col items-center">
      <div ref={containerRef} className="w-full max-w-3xl" />
    </div>
  );
}
