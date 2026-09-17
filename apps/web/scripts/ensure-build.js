const fs = require('fs');
const path = require('path');

// Normalize drive letter casing on Windows (c:\ -> C:\) to avoid Webpack/readlink path mismatches
if (process.platform === 'win32') {
  const cwd = process.cwd();
  if (cwd.charAt(1) === ':') {
    const uppercaseCwd = cwd.charAt(0).toUpperCase() + cwd.slice(1);
    if (cwd !== uppercaseCwd) {
      try {
        process.chdir(uppercaseCwd);
      } catch {}
    }
  }
}

const nextDir = path.resolve(__dirname, '..', '.next');

// Clean stale build manifests and output chunks to prevent Windows OneDrive EINVAL errors,
// but PRESERVE .next/cache to enable instant incremental Webpack/Turbopack compilations.
if (fs.existsSync(nextDir)) {
  const staleItems = [
    'app-build-manifest.json',
    'build-manifest.json',
    'prerender-manifest.json',
    'routes-manifest.json',
    'BUILD_ID',
    'server',
    'static',
    'types',
  ];
  for (const item of staleItems) {
    try {
      fs.rmSync(path.join(nextDir, item), { recursive: true, force: true });
    } catch {}
  }
}
