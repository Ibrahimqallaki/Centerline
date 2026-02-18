import React, { useState } from 'react';
import { MachinePoint } from '../types';

interface PhasingGaugeProps {
  currentDegree: number;
  points: MachinePoint[];
}

const PhasingGauge: React.FC<PhasingGaugeProps> = ({ currentDegree, points }) => {
  const [testDegree, setTestDegree] = useState(currentDegree);

  // Filter points that have a phaseAngle defined
  const phasePoints = points.filter(p => p.phaseAngle !== undefined);
  const radius = 120;
  const center = 150;

  // Helper to calculate position on circle
  const getPos = (deg: number, r: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const needlePos = getPos(testDegree, radius - 10);

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-cyan-400 uppercase tracking-widest">360° Cykel Synk</h3>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Dra i reglaget för att simulera maskinens cykel och se var kritiska moment inträffar.
        Detta förhindrar krascher genom att verifiera timing.
      </p>

      <div className="relative w-[300px] h-[300px] mb-6">
        <svg width="300" height="300" className="drop-shadow-2xl">
          {/* Outer Ring */}
          <circle cx={center} cy={center} r={radius} fill="#111827" stroke="#374151" strokeWidth="12" />
          
          {/* Ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const deg = i * 10;
            const p1 = getPos(deg, radius - 6);
            const p2 = getPos(deg, radius + 6);
            return (
              <line 
                key={i} 
                x1={p1.x} y1={p1.y} 
                x2={p2.x} y2={p2.y} 
                stroke={i % 9 === 0 ? "#fff" : "#6b7280"} 
                strokeWidth={i % 9 === 0 ? 3 : 1} 
              />
            );
          })}

          {/* Phase Points */}
          {phasePoints.map((p) => {
            const pos = getPos(p.phaseAngle!, radius);
            const isNear = Math.abs(testDegree - p.phaseAngle!) < 10;
            return (
              <g key={p.id}>
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r={isNear ? 12 : 8} 
                  fill={isNear ? '#ef4444' : '#fbbf24'} 
                  className="transition-all duration-200"
                />
                <text 
                  x={pos.x} 
                  y={pos.y} 
                  dx={isNear ? 15 : 10} 
                  dy={5} 
                  fill="white" 
                  fontSize={isNear ? 14 : 10}
                  className="font-mono bg-black"
                  style={{ textShadow: '0 2px 4px black' }}
                >
                  {p.phaseAngle}° ({p.id})
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <line x1={center} y1={center} x2={needlePos.x} y2={needlePos.y} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
          <circle cx={center} cy={center} r="10" fill="#06b6d4" />
          
          {/* Digital Readout */}
          <text x={center} y={center + 50} textAnchor="middle" fill="#06b6d4" fontSize="24" fontFamily="monospace" fontWeight="bold">
            {testDegree}°
          </text>
        </svg>
      </div>

      <div className="w-full px-8">
        <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Justera Master Encoder</label>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={testDegree} 
          onChange={(e) => setTestDegree(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>360°</span>
        </div>
      </div>
    </div>
  );
};

export default PhasingGauge;
