const retry = async (
  asyncRequest,
  onInitialError,
  totalAttempts = 10,
  sleepTime = 2000
) => {
  let lastError;
  let attempts = 0;

  while (totalAttempts > attempts) {
    try {
      return asyncRequest();
    } catch (error) {
      if (attempts === 0) {
        onInitialError();
      }
      lastError = error;
      attempts++;
      await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
  }
  return Promise.reject(lastError);
};

export default retry;
