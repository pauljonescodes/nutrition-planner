import { Item } from "../data/model/Item";

export interface AppState {
  ingredientFormDrawerIsOpen?: boolean;
  recipeFormDrawerIsOpen?: boolean;
  updateItem?: Item;
  deleteItem?: Item;
  setAppState?: (value: AppState) => void;
}
