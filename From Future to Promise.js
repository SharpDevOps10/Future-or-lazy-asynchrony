'use strict';
class Future {
  constructor(executor) {
    this.executor = executor;
  }
  static of(value) {
    return new Future((resolve) => resolve(value));
  }
  chain(fn) {
    return new Future((resolve, reject) => this.fork(
      (value) => fn(value).fork(resolve, reject),
      (error) => reject(error),
    ));

  }
  map(fn) {
    return this.chain((value) => Future.of(fn(value)));

  }
  fork(successful, failed) {
    this.executor(successful, failed);
  }
}
const promisify = (future) => new Promise((resolve, reject) => {
  future.fork(resolve, reject);
});
const future = new Future((resolve) => resolve(69));
const promise = promisify(future);
promise.then(
  (value) => console.log(value),
  (error) => console.error(error),
);
const check = promise instanceof Promise;
console.log(check);
