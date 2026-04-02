import autocannon from 'autocannon';

const url = 'http://localhost:3000';

const instance = autocannon({
  url,
  connections: 20, // 20 concurrent users
  pipelining: 1,
  duration: 10, // 10 seconds
  requests: [
    {
      method: 'GET',
      path: '/',
    },
    {
      method: 'GET',
      path: '/api/history?email=test@example.com',
    }
  ]
}, (err, result) => {
  if (err) {
    console.error('Error running load test:', err);
  } else {
    console.log('Load test completed successfully!');
    console.log(autocannon.printResult(result));
  }
});

autocannon.track(instance, { renderProgressBar: true });
