const axios = require('axios');

const testEndpoint = async (url) => {
  console.time('GET Request');
  await axios.get(url);
  console.timeEnd('GET Request');
};

const url = 'http://localhost:3000/posts';

(async () => {
  console.log('First request (should be slower):');
  await testEndpoint(url);

  console.log('Second request (should be faster):');
  await testEndpoint(url);
})();
