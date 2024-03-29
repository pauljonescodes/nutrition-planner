import { Fragment, useState } from 'react';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';
import { useTranslation } from 'react-i18next';
import { DeleteAlertDialog } from '../components/DeleteAlertDialog';
import { ItemInfiniteTableContainer } from '../components/ItemInfiniteTableContainer';
import { GroupDrawer } from '../components/drawers/GroupDrawer';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import {
  ServingOrTotalEnum,
  toggleServingOrTotal,
} from '../data/interfaces/ServingOrTotalEnum';

export default function GroupsPage() {
  const { t } = useTranslation();
  const [nameSearchState, setNameSearchState] = useState<string>('');
  const [editItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null,
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const [servingOrTotalState, setServingOrTotalState] =
    useState<ServingOrTotalEnum>(ServingOrTotalEnum.serving);
  const collection = useRxCollection<RxNPItemDocument>('item');

  const selector: any = {
    type: ItemTypeEnum.group,
    name: { $regex: `\\b${nameSearchState}.*` },
  };

  const query = useRxQuery(
    collection?.find({
      selector,
    })!,
    {
      pageSize: 12,
      pagination: 'Infinite',
    },
  );

  return (
    <>
      <ItemInfiniteTableContainer
        nameSearch={nameSearchState}
        emptyStateText={t('groupsEmpty')}
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
        onResult={(result: boolean) => {
          if (result) {
            deleteItemState?.remove();
          }
          setDeleteItemState(null);
        }}
      />
    </>
  );
}
