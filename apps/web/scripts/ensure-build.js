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

// Clean stale build manifests to prevent Windows OneDrive EINVAL readlink errors
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
} catch {
  const conflicting = [
    'app-build-manifest.json',
    'build-manifest.json',
    'prerender-manifest.json',
    'BUILD_ID',
    path.join('server', 'app'),
    path.join('server', 'pages'),
  ];
  for (const item of conflicting) {
    try {
      fs.rmSync(path.join(nextDir, item), { recursive: true, force: true });
    } catch {}
  }
}
