async function retr(func, args, tries, onError) {
  try {
    return func.apply(null, args);
  } catch (error) {
    onError && onError();

    console.log('debug', tries);

    if (tries === 1) {
      throw error;
    }
    setTimeout(() => retr(func, args, tries - 1), 3000);
  }
}

// async function retr(func, args, onError) {
//   try {
//     return func.apply(null, args);
//   } catch (error) {
//     onError();
//     const interval = setInterval( () => func.apply(null, args) ,3000)
//   }
// }

// class retry {
//   constructor(func, args, onError, maxTries) {
//     this.func = func;
//     this.args = args;
//     this.onError = onError;
//     this.maxTries = maxTries;
//   }

//   start = () => {
//     return
//   }

//   try = () => {
//     try {

//     }
//   }
// }

// export default retry;
export default retr;
