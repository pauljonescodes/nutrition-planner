import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { RecipeDrawer } from "../components/drawers/RecipeDrawer";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import {
  CalculationTypeEnum,
  toggleCalculationType,
} from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType } from "../data/yup/item";

export default function RecipesPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const [calculationType, setCalculationType] = useState<CalculationTypeEnum>(
    CalculationTypeEnum.perServing
  );
  const collection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted, resetList } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.recipe,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: 12,
      pagination: "Infinite",
    }
  );

  return (
    <Fragment>
      <ItemInfiniteTableContainer
        items={result}
        nameSearch={nameSearch}
        onNameSearchChange={(value: string) => {
          setNameSearch(value);
        }}
        calculationType={calculationType}
        onToggleCalculationType={() =>
          setCalculationType(toggleCalculationType(calculationType))
        }
        queryFetchMore={fetchMore}
        queryIsExhausted={isExhausted}
        onEdit={(value) => setEditItem(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON() as ItemInferredType;
          const id = dataid();
          newValue.id = id;
          newValue.createdAt = new Date();
          newValue.name = `${newValue.name}-copy`;
          collection?.upsert(newValue);
        }}
        onDelete={(value) => setDeleteItem(value)}
      />
      <RecipeDrawer
        item={editItem}
        onResult={async (item) => {
          setEditItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item as ItemInferredType);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItem !== null}
        onResult={function (result: boolean): void {
          if (result) {
            deleteItem?.remove();
          }
          setDeleteItem(null);
        }}
      />
    </Fragment>
  );
}
