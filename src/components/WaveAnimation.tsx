"use client";

import React, { useRef, useEffect } from "react";

// Function to generate a pointy sine wave SVG path
function generateWavePath({
  amplitude = 32, // increased amplitude
  frequency = 2.5, // increased frequency
  phase = 0,
  width = 1440,
  height = 320,
  yOffset = 180,
  points = 60,
  sharpness = 1.7, // new sharpness parameter
}) {
  let d = `M0,${yOffset}`;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * width;
    // Pointier wave using powered sine
    const base = Math.sin((frequency * Math.PI * x) / width + phase);
    const y = yOffset + amplitude * Math.sign(base) * Math.pow(Math.abs(base), sharpness);
    d += ` L${x},${y}`;
  }
  d += ` L${width},${height} L0,${height}Z`;
  return d;
}

const WaveAnimation = () => {
  const waveRef = useRef<SVGPathElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    let phase = 0;
    const animate = () => {
      phase += 0.015; // Slow, smooth movement
      if (waveRef.current) {
        waveRef.current.setAttribute(
          "d",
          generateWavePath({
            amplitude: 32,
            frequency: 2.5,
            phase,
            width: 1440,
            height: 320,
            yOffset: 180,
            points: 60,
            sharpness: 1.7,
          })
        );
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none">
      <svg
        className="w-full h-40 md:h-56"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={waveRef}
          fill="#0099ff"
          fillOpacity="1"
          d={generateWavePath({ amplitude: 32, frequency: 2.5, phase: 0, width: 1440, height: 320, yOffset: 180, points: 60, sharpness: 1.7 })}
        />
      </svg>
      <div className="w-full flex justify-center items-center absolute bottom-0 left-0 pb-4 pointer-events-auto select-auto">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default WaveAnimation; 