import { nanoid } from "nanoid";

export function dataid(): string {
  var anId = nanoid(6);

  // RxDb does not allow underscores in 0th position
  while (anId[0] === "_") {
    anId = nanoid(6);
  }

  return anId;
}
