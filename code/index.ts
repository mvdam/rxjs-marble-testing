import { of } from "rxjs";
import { groupBy, mergeMap, concatWith, concat } from "rxjs/operators";

const start = async () => {
  type Person = { name: string };
  type Pet = { kind: "cat" | "dog" };

  function isPerson(value: Person | Pet): value is Person {
    return "name" in value;
  }

  const person: Person = { name: "Judy" };
  const pet: Pet = { kind: "cat" };

  const o = of(person, pet).pipe(
    groupBy(isPerson),
    mergeMap((group) => {
      if (group.key) {
        const inferred = group; // -> Person
        return inferred;
      } else {
        const inferred = group; // -> Pet
        return inferred;
      }
    })
  );
};

start();
