import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { GroupDrawer } from "../components/drawers/GroupDrawer";
import ItemInfiniteTableContainer from "../components/ItemInfiniteTableContainer";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/item-type-enum";
import { RxDBItemDocument } from "../data/rxdb";
import {
  ServingOrTotalEnum,
  toggleServingOrTotal,
} from "../data/serving-or-total-enum";

export default function GroupsPage() {
  const [nameSearchState, setNameSearchState] = useState<string>("");
  const [editItemState, setEditItemState] = useState<RxDBItemDocument | null>(
    null
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxDBItemDocument | null>(null);
  const [servingOrTotalState, setServingOrTotalState] =
    useState<ServingOrTotalEnum>(ServingOrTotalEnum.serving);
  const collection = useRxCollection<RxDBItemDocument>("item");
  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.group,
        name: { $regex: new RegExp("\\b" + nameSearchState + ".*", "i") },
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
        nameSearch={nameSearchState}
        emptyStateText="Groups are collections of Items or other Groups, like a recipe or meal."
        onNameSearchChange={(value: string) => {
          setNameSearchState(value);
        }}
        servingOrTotal={servingOrTotalState}
        onToggleServingOrTotal={() =>
          setServingOrTotalState(toggleServingOrTotal(servingOrTotalState))
        }
        documents={query.result}
        fetchMore={query.fetchMore}
        isFetching={query.isFetching}
        isExhausted={query.isExhausted}
        onEdit={(value) => setEditItemState(value)}
        onCopy={(value) => {
          const newValue = value.toMutableJSON();
          const id = dataid();
          newValue.id = id;
          newValue.date = new Date();
          newValue.name = `Copied ${newValue.name}`;
          collection?.upsert(newValue);
        }}
        onDelete={(value) => {
          setDeleteItemState(value);
        }}
      />
      <GroupDrawer
        item={editItemState}
        onResult={async (item) => {
          setEditItemState(null);
          if (item) {
            item.date = new Date();
            collection?.upsert(item);
            query.resetList();
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
