const { fusebox } = require('fuse-box');

function dev() {


  const fuse = fusebox({
    target: 'server',
    tsConfig: './tsconfig.json',
    watch: true,
    cache: true,
    hmr: true,
    entry: 'src/app.ts',
    logging: {
      level: "verbose"
    },
  });

  return fuse.runDev(handler => {
    handler.onComplete(output => {
      output.server.handleEntry({ nodeArgs: ['--inspect'], scriptArgs: [] });
    });
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
    target: "ESNext",
    handler: handler => {
      handler.onComplete(output => {
        output.server.handleEntry({ nodeArgs: [], scriptArgs: [] });
      });
    },
  });
}

let app;
if (process.env.NODE_ENV === 'production') {
  app = prod();
} else {
  app = dev();
}

app.then(console.log).catch(console.error);