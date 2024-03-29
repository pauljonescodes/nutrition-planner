import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import arSA from 'date-fns/locale/ar-SA';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import fr from 'date-fns/locale/fr';
import hi from 'date-fns/locale/hi';
import zhCN from 'date-fns/locale/zh-CN';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { Size } from 'electron';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  Culture,
  DateLocalizer,
  DateRange,
  Event,
  View,
  dateFnsLocalizer,
} from 'react-big-calendar';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { BigCalendarChakraToolbar } from '../components/BigCalendarChakraToolbar';
import { DeleteAlertDialog } from '../components/DeleteAlertDialog';
import { LogDrawer } from '../components/drawers/LogDrawer';
import {
  itemEquals,
  itemServingPriceCents,
  itemSumNutrition,
  itemZeroNutrition,
  logServingNutrition,
} from '../data/interfaces/ItemHelpers';
import { ItemInterface } from '../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { upsertLogInterface } from '../data/rxnp/RxNPDatabaseHelpers';
import {
  RxNPItemDocument,
  recursivelyPopulateSubitemsOfItems,
} from '../data/rxnp/RxNPItemSchema';
import {
  LocalStorageKeysEnum,
  useCurrencyLocalStorage,
  useLanguageLocalStorage,
} from '../utilities/useLocalStorageKey';

export interface RangeType {
  start: Date;
  end: Date;
}

export default function LogPage() {
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const collection = useRxCollection<RxNPItemDocument>('item');
  const [viewState, setViewState] = useLocalStorage<View>(
    LocalStorageKeysEnum.logViewState,
    'week',
  );
  const [dateRangeState, setDateRangeState] = useState<RangeType>({
    start: moment().startOf(viewState).toDate(),
    end: moment().endOf(viewState).toDate(),
  });
  const [logDrawerItemState, setLogDrawerItemState] =
    useState<ItemInterface | null>(null);
  const [eventsState, setEventsState] = useState<Event[] | undefined>([]);
  const [selectedEventState, setModalEventState] = useState<Event | null>(null);
  const [editItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null,
  );
  const [languageLocalStorage] = useLanguageLocalStorage();

  const [currencyLocalStorage] = useCurrencyLocalStorage();

  const currencyFormatter = new Intl.NumberFormat(languageLocalStorage, {
    style: 'currency',
    currency: currencyLocalStorage,
  });

  const currencyDenominator = currencyLocalStorage === 'JPY' ? 1 : 100;

  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.log,
        date: {
          $lt: dateRangeState.end.toISOString(),
          $gt: dateRangeState.start.toISOString(),
        },
      },
    })!,
  );

  function formatTitle(priceCents: number, nutrition: ItemInterface) {
    const formattableCurrencyAmount = (priceCents ?? 0) / currencyDenominator;
    const currencyString =
      formattableCurrencyAmount !== 0
        ? `${currencyFormatter.format(formattableCurrencyAmount)} | `
        : ``;
    return `${currencyString}${nutrition.energyKilocalories}kcal | ${nutrition.massGrams}g mass | ${nutrition.fatGrams}g fat | ${nutrition.carbohydrateGrams}g carbs | ${nutrition.proteinGrams}g protein`;
  }

  function titleForItemInterface(item: ItemInterface) {
    const nutrition = logServingNutrition(item);
    const priceCents = itemServingPriceCents(item);
    return formatTitle(priceCents, nutrition);
  }

  useEffect(() => {
    async function calculate() {
      const datesInRange: Date[] = [];
      let currentDate = dateRangeState.start;
      while (currentDate <= dateRangeState.end) {
        datesInRange.push(currentDate);
        currentDate = moment(currentDate).add(1, 'day').toDate();
      }

      const populatedResults = await recursivelyPopulateSubitemsOfItems(
        query.result,
      );

      const events = populatedResults.map((value) => {
        return {
          title: titleForItemInterface(value),
          start: new Date(value.date!),
          end: new Date(new Date(value.date!).getTime() + 1 * 60 * 60 * 1000),
          allDay: false,
          resource: value,
        };
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const dateInRange of datesInRange) {
        const populatedLogsOnDate = populatedResults.filter((value) =>
          moment(dateInRange).isSame(moment(value.date), 'day'),
        );

        const summedItem = itemSumNutrition(
          populatedLogsOnDate.map((value) => logServingNutrition(value)),
        );
        const summedPrice = populatedLogsOnDate.reduce((previous, current) => {
          return previous + (itemServingPriceCents(current) ?? 0);
        }, 0);
        if (!itemEquals(summedItem, itemZeroNutrition)) {
          events.push({
            title: formatTitle(summedPrice, summedItem),
            start: dateInRange,
            end: moment(dateInRange).add(1, 'hour').toDate(),
            allDay: true,
            resource: summedItem,
          });
        }
      }

      setEventsState(events);
    }

    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.result, collection, dateRangeState]);

  const handleItemResult = useCallback(
    async (newItem: ItemInterface | null) => {
      setLogDrawerItemState(null);
      setEditItemState(null);
      if (newItem) {
        await upsertLogInterface(newItem, collection ?? undefined);
      }
    },
    [collection],
  );

  const handleItemDelete = useCallback(
    (item: ItemInterface | null) => {
      setLogDrawerItemState(null);
      setEditItemState(null);
      if (item && collection) {
        collection.findOne(item.id).remove();
      }
    },
    [collection],
  );

  const size: Size = useWindowSize();
  useEffect(() => {
    if (size.width < 480) {
      if (viewState !== 'day') {
        setViewState('day');
      }
    } else if (size.width < 768 && viewState === 'month') {
      setViewState('week');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const [languageLocaleStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
      en: enUS,
      cmn: zhCN,
      ar: arSA,
      fr,
      hi,
      es,
    },
  });

  return (
    <>
      <Box
        height="calc(100vh - 76px - env(safe-area-inset-top))"
        overflow="scroll"
        px={3}
      >
        <Calendar
          view={viewState}
          onView={(view: View) => {
            setViewState(view);
          }}
          selectable
          localizer={localizer}
          culture={languageLocaleStorage}
          onRangeChange={(range: any) => {
            if (range.start && range.end) {
              setDateRangeState({
                start: moment(range.start).toDate(),
                end: moment(range.end).toDate(),
              });
            }
          }}
          onNavigate={(date, view) => {
            if (view === 'day') {
              setDateRangeState({
                start: moment(date).startOf('day').toDate(),
                end: moment(date).endOf('day').toDate(),
              });
            } else if (view === 'week') {
              setDateRangeState({
                start: moment(date)
                  .startOf('isoWeek')
                  .subtract(1, 'day')
                  .toDate(),
                end: moment(date).endOf('isoWeek').subtract(1, 'day').toDate(),
              });
            }
          }}
          formats={{
            dayHeaderFormat: 'eee LLL d',
            dayRangeHeaderFormat: (
              range: DateRange,
              culture?: Culture,
              aLocalizer?: DateLocalizer,
            ) => {
              return `${aLocalizer?.format(
                range.start,
                'LLL d',
                culture,
              )}-${aLocalizer?.format(range.end, 'LLL d', culture)}`;
            },
          }}
          onDoubleClickEvent={async (event) => {
            setDeleteItemState(
              (await collection?.findOne(event.resource.id).exec()) ?? null,
            );
          }}
          onSelectEvent={(event) => {
            if (event.allDay) {
              setModalEventState(event);
            } else if (event.resource) {
              const found = query.result.find(
                (value) => value.id === event.resource.id,
              );
              if (found) {
                setEditItemState(found);
              }
            }
          }}
          onSelectSlot={(slotInfo: { start: Date }) => {
            setLogDrawerItemState({
              type: ItemTypeEnum.log,
              date: slotInfo.start.toISOString(),
            });
          }}
          events={eventsState}
          views={{ day: true, month: true, week: true }}
          startAccessor="start"
          endAccessor="end"
          components={{
            toolbar: BigCalendarChakraToolbar,
          }}
        />
      </Box>
      <DeleteAlertDialog
        isOpen={deleteItemState !== null}
        onResult={async (result: boolean) => {
          if (result) {
            deleteItemState?.remove();
          }
          setDeleteItemState(null);
        }}
      />
      <Modal
        isOpen={selectedEventState !== null}
        onClose={() => setModalEventState(null)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedEventState?.resource &&
              titleForItemInterface(selectedEventState.resource)}
          </ModalBody>
        </ModalContent>
      </Modal>
      <LogDrawer
        item={editItemState != null ? editItemState?.toMutableJSON() : null}
        onResult={handleItemResult}
        onDelete={handleItemDelete}
      />
      <LogDrawer item={logDrawerItemState} onResult={handleItemResult} />
    </>
  );
}
