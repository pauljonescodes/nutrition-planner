import { nanoid } from "nanoid";

export function dataid(): string {
  var anId = nanoid();

  // RxDb does not allow underscores in 0th position
  while (anId[0] === "_") {
    anId = nanoid();
  }

  return anId;
}
