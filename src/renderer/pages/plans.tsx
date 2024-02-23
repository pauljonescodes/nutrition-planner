import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';
import { DeleteAlertDialog } from '../components/DeleteAlertDialog';
import { ItemInfiniteTableContainer } from '../components/ItemInfiniteTableContainer';
import { PlanDrawer } from '../components/drawers/PlanDrawer';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { ServingOrTotalEnum } from '../data/interfaces/ServingOrTotalEnum';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import { dataid } from '../utilities/dataid';

export default function PlansPage() {
  const { t } = useTranslation();
  const [nameSearchState, setNameSearchState] = useState<string>('');
  const [editItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null,
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const rxCollection = useRxCollection<RxNPItemDocument>('item');
  const query = useRxQuery(
    rxCollection?.find({
      selector: {
        type: ItemTypeEnum.plan,
        name: { $regex: `\\b${nameSearchState}.*` },
      },
    })!,
    {
      pageSize: 12,
      pagination: 'Infinite',
    },
  );

  return (
    <>
      <ItemInfiniteTableContainer
        documents={query.result}
        fetchMore={query.fetchMore}
        isFetching={query.isFetching}
        isExhausted={query.isExhausted}
        nameSearch={nameSearchState}
        emptyStateText={t('plansEmpty')}
        onNameSearchChange={(value: string) => {
          setNameSearchState(value);
        }}
        servingOrTotal={ServingOrTotalEnum.total}
        onEdit={(value) => setEditItemState(value)}
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
