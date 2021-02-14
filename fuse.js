const { fusebox } = require('fuse-box');

function dev() {


  const fuse = fusebox({
    target: 'server',
    tsConfig: './tsconfig.json',
    watcher: true,
    cache: true,
    hmr: true,
    entry: 'src/app.ts',
    sourceMap: true,
    dependencies: { serverIgnoreExternals: true },
    logging: { level: 'succinct' }
  });

  return fuse.runDev().then(({ onComplete, onWatch }) => {
    return onComplete(({ server }) => {
      if (onWatch) {
        onWatch(() => {
          server.stop();
          server.start({ argsBefore: ["--inspect"] })
        })
      } else {
        server.start({ argsBefore: ["--inspect"] })
      }
    })
  });
}

function prod() {
  const fuse = fusebox({
    target: 'server',
    tsConfig: './tsconfig.json',
    entry: 'src/app.ts',
  });

  return fuse.runProd({
    uglify: true,
    target: 'server'
  }).then(({ onComplete }) => onComplete(({ server }) => server.start({})));
}

let app;
if (process.env.NODE_ENV === 'production') {
  app = prod();
} else {
  app = dev();
}

app.then(console.log).catch(console.error);
