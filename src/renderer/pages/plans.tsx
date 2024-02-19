import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { ItemInfiniteTableContainer } from "../components/ItemInfiniteTableContainer";
import { PlanDrawer } from "../components/drawers/PlanDrawer";
import { dataid } from "../utilities/dataid";
import { ItemTypeEnum } from "../data/interfaces/ItemTypeEnum";
import { RxNPItemDocument } from "../data/rxnp/RxNPItemSchema";
import { ServingOrTotalEnum } from "../data/interfaces/ServingOrTotalEnum";

export default function PlansPage() {
  const [nameSearchState, setNameSearchState] = useState<string>("");
  const [editItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const rxCollection = useRxCollection<RxNPItemDocument>("item");
  const query = useRxQuery(
    rxCollection?.find({
      selector: {
        type: ItemTypeEnum.plan,
        name: { $regex: `\\b${nameSearchState}.*` },
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
        documents={query.result}
        fetchMore={query.fetchMore}
        isFetching={query.isFetching}
        isExhausted={query.isExhausted}
        nameSearch={nameSearchState}
        emptyStateText="Plans are collections of Groups and Items, and can be used to calculate and log a day's worth of nutrition."
        onNameSearchChange={(value: string) => {
          setNameSearchState(value);
        }}
        servingOrTotal={ServingOrTotalEnum.total}
        onEdit={(value) => setEditItemState(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON();
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date().toISOString();
          newValue.name = `$Copied ${newValue.name}`;
          rxCollection?.upsert(newValue);
        }}
        onDelete={(value) => setDeleteItemState(value)}
      />
      <PlanDrawer
        item={editItemState}
        onResult={async (item) => {
          setEditItemState(null);
          if (item) {
            item.date = new Date().toISOString();
            rxCollection?.upsert(item);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItemState !== null}
        onResult={function (result: boolean): void {
          if (result) {
            deleteItemState?.remove();
          }
          setDeleteItemState(null);
        }}
      />
    </Fragment>
  );
}
