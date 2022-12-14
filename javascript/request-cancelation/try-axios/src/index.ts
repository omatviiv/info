import axios from 'axios';

const controller = new AbortController();
const { signal } = controller;

async function beginFetch() {
  console.log('fetching');

  const url = 'https://httpbin.org/delay/3';
  
  try {
    const res = await axios(url, {
      method: 'get',
      signal,
    });
    
    console.log('fetch completed (not aborted): ', res);
  }
  catch (e) {
    console.error('Error: ', e);
  }
}

async function abortFetch() {
  console.log('aborting fetch');
  controller.abort();
}
