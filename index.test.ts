import { TestScheduler } from "rxjs/testing";
import { map, throttleTime, filter, concatMap, delay } from "rxjs/operators";
import { from, merge, Observable, of, throwError } from "rxjs";

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

const multiply = (value: Observable<number>) =>
  value.pipe(map((val) => val * 2));

it("multiplies every value", () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const stream = cold("a-b-c-|", { a: 1, b: 2, c: 3 });
    const expected = "   x-y-z-|";

    expectObservable(stream.pipe(multiply)).toBe(expected, {
      x: 2,
      y: 4,
      z: 6,
    });
  });
});

const filterLowerThan5 = (value: Observable<number>) =>
  value.pipe(filter((val) => val < 5));

it("only emits values lower than 5", () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const stream = cold("   a-b-c-|", { a: 10, b: 2, c: 30 });
    const expected = "--------b---|";

    expectObservable(stream.pipe(filterLowerThan5)).toBe(expected, {
      b: 2,
    });
  });
});

// it("throws an error when it tries to multiply value outside the business logic", () => {
//   testScheduler.run((helpers) => {
//     const { cold, expectObservable } = helpers;
//     const stream = cold("a-b-c-#");
//     const expected = "a-b-c-#";

//     expectObservable(stream).toBe(expected);
//   });
// });

it("supports hot observables", () => {
  testScheduler.run(({ hot, expectObservable }) => {
    const e1 = hot("----a--^--b-------c--|");
    const e2 = hot("  ---d-^--e---------f-----|");
    const expected = "---------------(be)----c-f-----|";

    expectObservable(merge(e1, e2)).toBe(expected);
  });
});
