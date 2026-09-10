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
      } catch {
        // fallback
      }
    }
  }
}

const nextDir = path.resolve(__dirname, '..', '.next');

// Permanently prevent EINVAL readlink and ENOENT server/app/page.js:
// When transitioning from 'next build' to 'next dev', stale production manifests
// (app-build-manifest.json, BUILD_ID, server/app/page.js) cause Next.js dev server
// to attempt invalid readlink calls on Windows NTFS/OneDrive.
try {
  const isProductionArtifact =
    fs.existsSync(path.join(nextDir, 'BUILD_ID')) ||
    fs.existsSync(path.join(nextDir, 'app-build-manifest.json')) ||
    fs.existsSync(path.join(nextDir, 'server', 'app', 'page.js'));

  if (isProductionArtifact) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch {
      // If root .next is locked by OneDrive, remove the conflicting manifest files individually
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
  }
} catch (e) {
  // Silent fallback
}

// Ensure required dev directories exist
try {
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
  }
  const serverDir = path.join(nextDir, 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }
} catch (e) {
  // Silent fallback
}
