const retry = async (
  asyncRequest,
  onInitialError,
  totalAttempts = 10,
  sleepTime = 2000
) => {
  let latestError;
  let attempts = 0;

  while (attempts < totalAttempts) {
    try {
      return await asyncRequest();
    } catch (error) {
      if (attempts === 0) {
        onInitialError();
      }
      latestError = error;
      attempts++;
      await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
  }
  throw latestError;
};

export default retry;
