const fs = require('fs');
const path = require('path');

const nextDir = path.resolve(__dirname, '..', '.next');
const serverDir = path.join(nextDir, 'server');

try {
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
  }
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  const routesManifestPath = path.join(nextDir, 'routes-manifest.json');
  if (!fs.existsSync(routesManifestPath)) {
    const minimalRoutesManifest = {
      version: 3,
      pages404: true,
      caseSensitive: false,
      basePath: '',
      redirects: [],
      headers: [],
      dynamicRoutes: [],
      staticRoutes: [],
      dataRoutes: [],
      rsc: {
        header: 'rsc',
        varyHeader: 'rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch',
        prefetchHeader: 'next-router-prefetch',
        didPostponeHeader: 'x-nextjs-postponed',
        contentTypeHeader: 'text/x-component',
        suffix: '.rsc',
        prefetchSuffix: '.prefetch.rsc',
        prefetchSegmentHeader: 'next-router-segment-prefetch',
        prefetchSegmentSuffix: '.segment.rsc',
        prefetchSegmentDirSuffix: '.segments'
      },
      rewrites: { beforeFiles: [], afterFiles: [], fallback: [] }
    };
    fs.writeFileSync(routesManifestPath, JSON.stringify(minimalRoutesManifest, null, 2), 'utf8');
  }

  const middlewareManifestPath = path.join(serverDir, 'middleware-manifest.json');
  if (!fs.existsSync(middlewareManifestPath)) {
    const minimalMiddlewareManifest = {
      version: 3,
      middleware: {},
      sortedMiddleware: [],
      functions: {}
    };
    fs.writeFileSync(middlewareManifestPath, JSON.stringify(minimalMiddlewareManifest, null, 2), 'utf8');
  }
} catch (e) {
  // Silent fallback if OneDrive or FS momentarily blocks
}
