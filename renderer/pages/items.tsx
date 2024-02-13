import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { ItemDrawer } from "../components/drawers/ItemDrawer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/item-type-enum";
import { RxDBItemDocument } from "../data/rxdb";
import {
  ServingOrTotalEnum,
  toggleServingOrTotal,
} from "../data/serving-or-total-enum";

export default function ItemsPage() {
  const [nameSearchState, setNameSearchState] = useState<string>("");
  const [drawerItemState, setEditItemState] = useState<RxDBItemDocument | null>(
    null
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxDBItemDocument | null>(null);
  const collection = useRxCollection<RxDBItemDocument>("item");
  const [servingOrTotalState, setServingOrTotalState] = useState(
    ServingOrTotalEnum.serving
  );
  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.item,
        name: { $regex: new RegExp("\\b" + nameSearchState + ".*", "i") },
      },
    })!,
    {
      pageSize: 12,
      pagination: "Infinite",
    }
  );

  console.log(query.result);

  return (
    <Fragment>
      <ItemInfiniteTableContainer
        documents={query.result}
        fetchMore={query.fetchMore}
        isFetching={query.isFetching}
        isExhausted={query.isExhausted}
        nameSearch={nameSearchState}
        emptyStateText="Items are what you buy, and you can add one with the plus button above."
        onNameSearchChange={(value: string) => {
          setNameSearchState(value);
        }}
        servingOrTotal={servingOrTotalState}
        onToggleServingOrTotal={() =>
          setServingOrTotalState(toggleServingOrTotal(servingOrTotalState))
        }
        onEdit={(value) => setEditItemState(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON();
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date();
          newValue.name = `Copied ${newValue.name}`;
          collection?.upsert(newValue);
        }}
        onDelete={async (value) => {
          setDeleteItemState(value);
        }}
      />
      <ItemDrawer
        item={drawerItemState}
        onResult={(item) => {
          setEditItemState(null);
          if (item) {
            item.date = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItemState !== null}
        onResult={async (result: boolean) => {
          if (result) {
            deleteItemState?.remove();
          }
          setDeleteItemState(null);
        }}
      />
    </Fragment>
  );
}
