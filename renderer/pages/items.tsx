import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { ItemDrawer } from "../components/drawers/ItemDrawer";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import {
  CalculationTypeEnum,
  toggleCalculationType,
} from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType } from "../data/yup/item";

export default function ItemsPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const [calculationType, setCalculationType] = useState<CalculationTypeEnum>(
    CalculationTypeEnum.perServing
  );
  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.item,
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
        query={query}
        nameSearch={nameSearch}
        emptyStateText="Items are what you buy, and you can add one with the plus button above."
        onNameSearchChange={(value: string) => {
          setNameSearch(value);
        }}
        calculationType={calculationType}
        onToggleCalculationType={() =>
          setCalculationType(toggleCalculationType(calculationType))
        }
        onEdit={(value) => setEditItem(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON() as ItemInferredType;
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date();
          newValue.name = `Copied ${newValue.name}`;
          collection?.upsert(newValue);
        }}
        onDelete={async (value) => {
          setDeleteItem(value);
        }}
      />
      <ItemDrawer
        item={drawerItem}
        onResult={(item) => {
          setEditItem(null);
          if (item) {
            item.date = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItem !== null}
        onResult={async (result: boolean) => {
          if (result) {
            deleteItem?.remove();
          }
          setDeleteItem(null);
        }}
      />
    </Fragment>
  );
}
