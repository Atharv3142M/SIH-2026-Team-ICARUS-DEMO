import { readFile } from 'node:fs/promises';
import path from 'node:path';

const scenes = {
  simingshan: 'Simingshan',
  sculpture: 'Sculpture',
} as const;

export async function GET(request: Request) {
  const scene = new URL(request.url).searchParams.get('scene') ?? 'simingshan';
  const directory = scenes[scene as keyof typeof scenes];

  if (!directory) {
    return Response.json({ error: 'Unknown DroneSplat scene.' }, { status: 400 });
  }

  const cloudPath = path.join(
    process.cwd(),
    'DroneSplat',
    directory,
    'sparse',
    '0',
    'points3D.ply',
  );

  try {
    const cloud = await readFile(cloudPath);
    return new Response(cloud, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return Response.json(
      { error: 'DroneSplat point-cloud asset is unavailable.' },
      { status: 404 },
    );
  }
}
