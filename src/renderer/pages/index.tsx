import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Size } from "electron";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import {
  Calendar,
  Culture,
  DateLocalizer,
  DateRange,
  Event,
  View,
  dateFnsLocalizer,
} from "react-big-calendar";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { useWindowSize } from "usehooks-ts";
import { BigCalendarChakraToolbar } from "../components/BigCalendarChakraToolbar";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { LogDrawer } from "../components/drawers/LogDrawer";
import {
  itemSumNutrition,
  populatedItemServingNutrition,
  populatedItemServingPriceCents,
} from "../data/interfaces/ItemHelpers";
import { ItemInterface } from "../data/interfaces/ItemInterface";
import { ItemTypeEnum } from "../data/interfaces/ItemTypeEnum";
import {
  RxNPItemDocument,
  recursivelyPopulateSubitemsOfItems,
} from "../data/rxnp/RxNPItemSchema";
import { currencyFormatter } from "../utilities/currency-formatter";

export interface RangeType {
  start: Date;
  end: Date;
}

export default function LogPage() {
  const [deleteItemState, setDeleteItemState] =
    useState<RxNPItemDocument | null>(null);
  const collection = useRxCollection<RxNPItemDocument>("item");
  const [viewState, setViewState] = useState<View>("day");
  const [dateRangeState, setDateRangeState] = useState<RangeType>({
    start: moment().startOf("day").toDate(),
    end: moment().endOf("day").toDate(),
  });
  const [eventsState, setEventsState] = useState<Event[] | undefined>([]);
  const [selectedEvent, setModalEvent] = useState<Event | null>(null);
  const [editItemState, setEditItemState] = useState<RxNPItemDocument | null>(
    null
  );

  const query = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.log,
        date: {
          $lt: dateRangeState.end.toISOString(),
          $gt: dateRangeState.start.toISOString(),
        },
      },
    })!
  );

  function formatTitle(priceCents: number, nutrition: ItemInterface) {
    return `${currencyFormatter.format((priceCents ?? 0) / 100)} | ${nutrition.energyKilocalories
      }kcal | ${nutrition.massGrams}g mass | ${nutrition.fatGrams}g fat | ${nutrition.carbohydrateGrams
      }g carbs | ${nutrition.proteinGrams}g protein`;
  }

  function titleForItemInterface(item: ItemInterface) {
    const nutrition = populatedItemServingNutrition(item);
    const priceCents = populatedItemServingPriceCents(item);
    return formatTitle(priceCents, nutrition);
  }

  useEffect(() => {
    async function calculate() {
      var datesInRange = new Array<Date>();
      var currentDate = dateRangeState.start;
      while (currentDate <= dateRangeState.end) {
        datesInRange.push(currentDate);
        currentDate = moment(currentDate).add(1, "day").toDate();
      }

      const populatedResults = await recursivelyPopulateSubitemsOfItems(
        query.result
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

      for (const dateInRange of datesInRange) {
        const populatedLogsOnDate = populatedResults.filter((value) =>
          moment(dateInRange).isSame(moment(value.date), "day")
        );

        const summedNutrition = itemSumNutrition(
          populatedLogsOnDate.map((value) =>
            populatedItemServingNutrition(value)
          )
        );
        const summedPrice = populatedLogsOnDate.reduce((previous, current) => {
          return previous + (populatedItemServingPriceCents(current) ?? 0);
        }, 0);
        events.push({
          title: formatTitle(summedPrice, summedNutrition),
          start: dateInRange,
          end: moment(dateInRange).add(1, "hour").toDate(),
          allDay: true,
          resource: summedNutrition,
        });
      }

      setEventsState(events);
    }

    calculate();
  }, [query.result, collection, dateRangeState]);

  const size: Size = useWindowSize();
  if (size.width < 480) {
    if (viewState !== "day") {
      setViewState("day");
    }
  } else if (size.width < 768 && viewState === "month") {
    setViewState("week");
  }

  const locales = {
    "en-US": enUS,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  return (
    <Fragment>
      <Box height="calc(100vh - 76px)" overflow={"scroll"} px={3}>
        <Calendar
          view={viewState}
          onView={(view: View) => {
            setViewState(view);
          }}
          selectable
          localizer={localizer}
          onRangeChange={(range: any) => {
            if (range.start && range.end) {
              setDateRangeState({
                start: range.start,
                end: range.end,
              });
            }
          }}
          onNavigate={(date, view) => {
            if (view === "day") {
              setDateRangeState({
                start: moment(date).startOf("day").toDate(),
                end: moment(date).endOf("day").toDate(),
              });
            } else if (view === "week") {
              setDateRangeState({
                start: moment(date)
                  .startOf("isoWeek")
                  .subtract(1, "day")
                  .toDate(),
                end: moment(date).endOf("isoWeek").subtract(1, "day").toDate(),
              });
            }
          }}
          formats={{
            dayHeaderFormat: "eee LLL d",
            dayRangeHeaderFormat: (
              // October 30 - November 05
              range: DateRange,
              culture?: Culture,
              localizer?: DateLocalizer
            ) => {
              return `${localizer?.format(
                range.start,
                "LLL d",
                culture
              )}-${localizer?.format(range.end, "LLL d", culture)}`;
            },
          }}
          onDoubleClickEvent={async (event) => {
            setDeleteItemState(
              (await collection?.findOne(event.resource.id).exec()) ?? null
            );
          }}
          onSelectEvent={(event) => {
            if (event.allDay) {
              setModalEvent(event);
            } else if (event.resource) {
              const found = query.result.find(
                (value) => value.id === event.resource.id
              );
              if (found) {
                setEditItemState(found);
              }
            }
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
      <LogDrawer
        item={editItemState}
        onResult={(item) => {
          setEditItemState(null);
          if (item) {
            collection?.upsert(item);
          }
        }}
        onDelete={(item) => {
          setEditItemState(null);
          if (item) {
            collection?.findOne(item.id).remove();
          }
        }}
      />
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setModalEvent(null)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent?.resource &&
              titleForItemInterface(selectedEvent.resource)}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
