const retry = (func, args, tries = -1, onError) => {
  func.apply(null, args).catch(error => {
    onError();

    if (tries == 1) {
      throw error;
    }
    return retry(func, args, tries - 1);
  });
};

export default retry;
