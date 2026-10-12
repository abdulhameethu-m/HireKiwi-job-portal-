import concurrently from 'concurrently';

const { result } = concurrently(
  [
    {
      command: 'node server/src/index.js',
      name: 'api',
      prefixColor: 'blue'
    },
    {
      command: 'npx vite --host 127.0.0.1',
      name: 'web',
      prefixColor: 'green'
    }
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 0
  }
);

result.then(
  () => process.exit(0),
  () => process.exit(1)
);
