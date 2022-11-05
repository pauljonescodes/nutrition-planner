import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { PlanDrawer } from "../components/drawers/PlanDrawer";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { CalculationTypeEnum } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType } from "../data/yup/item";

export default function PlansPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const [calculationType] = useState<CalculationTypeEnum>(
    CalculationTypeEnum.total
  );
  const collection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.plan,
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
        emptyStateText="Plans are collections of Groups and Items, and can be used to calculate and log a day's worth of nutrition."
        onNameSearchChange={(value: string) => {
          setNameSearch(value);
        }}
        calculationType={calculationType}
        queryFetchMore={fetchMore}
        queryIsExhausted={isExhausted}
        onEdit={(value) => setEditItem(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON() as ItemInferredType;
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date();
          newValue.name = `$Copied {newValue.name}`;
          collection?.upsert(newValue);
        }}
        onDelete={(value) => setDeleteItem(value)}
      />
      <PlanDrawer
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
