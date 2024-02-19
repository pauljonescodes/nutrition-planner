export enum ServingOrTotalEnum {
  serving = "Serving price",
  total = "Total price",
}

export function toggleServingOrTotal(
  value: ServingOrTotalEnum
): ServingOrTotalEnum {
  switch (value) {
    case ServingOrTotalEnum.serving:
      return ServingOrTotalEnum.total;
    case ServingOrTotalEnum.total:
      return ServingOrTotalEnum.serving;
  }
}
