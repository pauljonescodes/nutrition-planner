import { DatabaseType } from "../data/DatabaseTypes";
import { ItemInferredType } from "../data/model/Item";

export interface AppState {
  database?: DatabaseType;
  ingredientFormDrawerIsOpen?: boolean;
  recipeFormDrawerIsOpen?: boolean;
  updateItem?: ItemInferredType;
  deleteItem?: ItemInferredType;
  setAppState?: (value: AppState) => void;
}
