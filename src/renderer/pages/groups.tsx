import { Fragment, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { ItemInfiniteTableContainer } from "../components/ItemInfiniteTableContainer";
import { GroupDrawer } from "../components/drawers/GroupDrawer";
import { dataid } from "../utilities/dataid";
import { ItemTypeEnum } from "../data/interfaces/ItemTypeEnum";
import { RxNPItemDocument } from "../data/rxnp/RxNPItemSchema";
import {
  ServingOrTotalEnum,
  toggleServingOrTotal,
} from "../data/interfaces/ServingOrTotalEnum";
import { useTranslation } from "react-i18next";

export default function GroupsPage() {
  const { t } = useTranslation();
  const [nameSearchState, setNameSearchState] = useState<string>("");
  const [editItemState, setdEitItemState] = useState<RxNPItemDocument | null>(
    null
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const [servingOrTotalState, setServingOrTotalState] =
    useState<ServingOrTotalEnum>(ServingOrTotalEnum.serving);
  const collection = useRxCollection<RxNPItemDocument>("item");

  const selector: any = {
    type: ItemTypeEnum.group,
    name: { $regex: `\\b${nameSearchState}.*` },
  };

  const query = useRxQuery(
    collection?.find({
      selector: selector,
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
        emptyStateText={t("groupsEmpty")}
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
          newValue.date = new Date().toISOString();
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
            item.date = new Date().toISOString();
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
