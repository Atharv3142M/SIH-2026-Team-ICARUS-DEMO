# Spatial Twin

Spatial Twin is an interactive prototype for demonstrating a UAV-derived spatial digital twin. It accepts a local video filename, runs a simulated reconstruction pipeline, and opens a 3D tactical viewer with layers, telemetry, measurements, and a command console.

This repository is a front-end demo. It does not upload the selected video or perform real photogrammetry, object detection, or geospatial processing.

The animated aircraft is a generic Mavic-class quadcopter study, informed by the Mavic 3's public aircraft specifications and official intro-video listing. It is not an official DJI model and carries no DJI branding. Reference: [DJI Mavic 3 downloads and specifications](https://www.dji.com/mavic-3/downloads).

## DroneSplat integration

The viewer can render the downloaded DroneSplat Simingshan and Sculpture sparse COLMAP point clouds from the local `DroneSplat/` directory. Select either scene in **DroneSplat Source** to load its real captured geometry. This is an authentic sparse reconstruction preview, not a trained 3D Gaussian Splat renderer.

DroneSplat training remains an offline GPU task. Its upstream workflow requires CUDA, PyTorch, SAM2, DUSt3R, and a 7,000-iteration training run; use the upstream repository for that pipeline, then export a web-friendly artifact for production serving.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Choose any local video on the opening screen to begin the simulated workflow.

## Verification

Run the production checks before deployment:

```bash
npm run lint
npm run build
```

## Deploying to Vercel

Import this Git repository in Vercel. Vercel detects Next.js automatically and uses the included `npm run build` command, which explicitly selects the verified webpack builder. No environment variables are required for this self-contained prototype.

The interface uses Next.js font optimization for Geist.
