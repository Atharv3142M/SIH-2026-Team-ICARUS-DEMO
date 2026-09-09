"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { HairlineBorder, TechnicalLabel, StatusIndicator } from './TacticalUI';

export default function RightPanel() {
  const { cursorCoord, telemetry } = useSystemStore();

  const toUTM = (val: number) => (500000 + val * 10).toFixed(2);
  const toNorth = (val: number) => (4500000 + val * 10).toFixed(2);
  const toWGS84 = (val: number, offset: number) => (offset + val * 0.00001).toFixed(6);

  // Fallback for telemetry before simulation starts
  const tel = telemetry || {
    hdg: 0, pit: 0, rol: 0, alt: 0, spd: 0, sat: 0, sig: 0, utmE: '0', utmN: '0'
  };

  return (
    <div className="h-full w-full border-l border-[#2d3436] bg-[#0a0c0d] flex flex-col font-mono text-[#dcdde1]">
      <div className="p-2 bg-[#1a1d1f] border-b border-[#2d3436] text-[10px] flex justify-between opacity-60">
        <span className="tracking-tighter uppercase">Telemetry_Stream</span>
        <span className="text-[#4cd137] animate-pulse font-bold">LIVE_FEED</span>
      </div>

      <div className="flex flex-col p-4 gap-6 overflow-y-auto">
        {/* Signal Diagnostics */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-2 tracking-widest uppercase font-bold">Signal_Diagnostics</h3>
          <HairlineBorder className="p-2 bg-[#0f1214] flex flex-col gap-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] opacity-50 uppercase">Link_Status</span>
              <StatusIndicator status="ACTIVE" label="LOCKED" />
            </div>
            <TechnicalLabel label="S_QUALITY" value={`${tel.sig}%`} highlight />
            <TechnicalLabel label="S_SATS" value={`${tel.sat}`} />
            <TechnicalLabel label="S_STATUS" value="STABLE" />
          </HairlineBorder>
        </section>

        {/* Coordinate Breakdown */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-2 tracking-widest uppercase font-bold">Coordinate_Breakdown</h3>
          <div className="flex flex-col gap-3">
            <HairlineBorder className="p-2 bg-[#0f1214]">
              <div className="text-[8px] opacity-30 mb-2 uppercase font-bold">UAV_UTM_PROJECTION</div>
              <TechnicalLabel label="EASTING" value={tel.utmE} highlight />
              <TechnicalLabel label="NORTHING" value={tel.utmN} highlight />
              <TechnicalLabel label="ALTITUDE" value={`${tel.alt.toFixed(3)}m`} highlight />
            </HairlineBorder>

            <HairlineBorder className="p-2 bg-[#0f1214]">
              <div className="text-[8px] opacity-30 mb-2 uppercase font-bold">CURSOR_UTM_PROJECTION</div>
              <TechnicalLabel label="EASTING" value={toUTM(cursorCoord.x)} />
              <TechnicalLabel label="NORTHING" value={toNorth(cursorCoord.z)} />
              <TechnicalLabel label="ALTITUDE" value={`${cursorCoord.y.toFixed(3)}m`} />
            </HairlineBorder>

            <HairlineBorder className="p-2 bg-[#0f1214]">
              <div className="text-[8px] opacity-30 mb-2 uppercase font-bold">WGS84_GEODETIC</div>
              <TechnicalLabel label="LATITUDE" value={toWGS84(cursorCoord.z, 45.1234)} />
              <TechnicalLabel label="LONGITUDE" value={toWGS84(cursorCoord.x, 12.5678)} />
              <TechnicalLabel label="ELLIPSOID" value="WGS84" />
            </HairlineBorder>
          </div>
        </section>

        {/* Recon Metrics */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-2 tracking-widest uppercase font-bold">Recon_Metrics</h3>
          <HairlineBorder className="p-2 bg-[#0f1214] flex flex-col gap-1">
            <TechnicalLabel label="RMSE_3D" value="0.43m" highlight />
            <TechnicalLabel label="COMPLETENESS" value="92.1%" />
            <TechnicalLabel label="CONFIDENCE" value="HIGH" />
          </HairlineBorder>
        </section>

        {/* Flight Data Grid */}
        <section className="flex-1">
          <h3 className="text-[9px] opacity-30 mb-2 tracking-widest uppercase font-bold">UAV_Flight_Data</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'HDG', value: `${tel.hdg.toFixed(1)}°` },
              { label: 'PIT', value: `${tel.pit.toFixed(2)}°` },
              { label: 'ROL', value: `${tel.rol.toFixed(2)}°` },
              { label: 'ALT', value: `${tel.alt.toFixed(1)}m` },
              { label: 'SPD', value: `${tel.spd.toFixed(1)}m/s` },
              { label: 'SAT', value: `${tel.sat}` },
            ].map(item => (
              <div key={item.label} className="border border-[#2d3436] p-1.5 bg-[#0f1214]">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] opacity-40 uppercase">{item.label}</span>
                  <span className="text-[10px] font-bold text-[#00a8ff]">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
