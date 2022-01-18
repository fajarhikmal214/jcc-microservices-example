const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function callWithRetry(fn, maxRetryCount) {
  return new Promise((resolve, reject) => {
    let retries = 1;
    const caller = () =>
      fn()
        .then(async (data) => {
          resolve(data);
        })
        .catch(async (error) => {
          if (retries < maxRetryCount) {
            retries++;
            await wait(2 ** retries * 10);
            caller();
          } else {
            reject(error);
          }
        });

    caller();
  });
}

module.exports = {
  callWithRetry,
}