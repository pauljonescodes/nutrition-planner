import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { GroupDrawer } from "../components/drawers/GroupDrawer";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import {
  CalculationTypeEnum,
  toggleCalculationType,
} from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType } from "../data/yup/item";

export default function GroupsPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const [calculationType, setCalculationType] = useState<CalculationTypeEnum>(
    CalculationTypeEnum.perServing
  );
  const collection = useRxCollection<ItemDocument>("item");
  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.group,
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
        nameSearch={nameSearch}
        emptyStateText="Groups are collections of items or other groups, like a recipe or meal."
        onNameSearchChange={(value: string) => {
          setNameSearch(value);
        }}
        calculationType={calculationType}
        onToggleCalculationType={() =>
          setCalculationType(toggleCalculationType(calculationType))
        }
        query={query}
        onEdit={(value) => setEditItem(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON() as ItemInferredType;
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date();
          newValue.name = `Copied ${newValue.name}`;
          collection?.upsert(newValue);
        }}
        onDelete={(value) => {
          setDeleteItem(value);
        }}
      />
      <GroupDrawer
        item={editItem}
        onResult={async (item) => {
          setEditItem(null);
          if (item) {
            item.date = new Date();
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
