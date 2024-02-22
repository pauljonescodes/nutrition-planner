import { Fragment, useState } from 'react';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';
import { useTranslation } from 'react-i18next';
import { DeleteAlertDialog } from '../components/DeleteAlertDialog';
import { ItemInfiniteTableContainer } from '../components/ItemInfiniteTableContainer';
import { ItemDrawer } from '../components/drawers/ItemDrawer';
import { dataid } from '../utilities/dataid';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import {
  ServingOrTotalEnum,
  toggleServingOrTotal,
} from '../data/interfaces/ServingOrTotalEnum';

export default function ItemsPage() {
  const { t } = useTranslation();
  const [nameSearchState, setNameSearchState] = useState<string>('');
  const [drawerItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null,
  );
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const collection = useRxCollection<RxNPItemDocument>('item');
  const [servingOrTotalState, setServingOrTotalState] = useState(
    ServingOrTotalEnum.serving,
  );
  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.item,
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
        emptyStateText={t('itemsEmpty')}
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
          newValue.date = new Date().toISOString();
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
            item.date = new Date().toISOString();
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
    </>
  );
}
