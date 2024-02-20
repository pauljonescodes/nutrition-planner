export enum ServingOrTotalEnum {
  serving = "servingPrice",
  total = "totalPrice",
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
