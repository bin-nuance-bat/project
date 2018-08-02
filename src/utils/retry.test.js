import retry from './retry';

test('Correctly returns what the function it is called with returns', () => {
  retry(() => 'foo').then(result => expect(result).toEqual('foo'));
});

test('Retries if initial is an error', () => {
  let previousCalls = false;
  const testFunction = () => {
    if (previousCalls) {
      return 'bar';
    } else {
      previousCalls = true;
      throw 'fooBar';
    }
  };

  const trialFunc = jest.fn;
  retry(testFunction, trialFunc).then(result => expect(result).toEqual('bar'));
});

test('Calls the on Initial errorFunc', () => {
  let previousCalls = false;
  const testFunction = jest.fn();

  const trialFunc = jest.fn();
  retry(testFunction, trialFunc);
  expect(trialFunc).toHaveBeenCalled();
});
