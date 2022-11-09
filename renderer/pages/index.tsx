import { Box } from "@chakra-ui/react";
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
  dateFnsLocalizer,
  DateLocalizer,
  DateRange,
  View,
} from "react-big-calendar";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { useWindowSize } from "usehooks-ts";
import { BigCalendarChakraToolbar } from "../components/BigCalendarChakraToolbar";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import {
  ItemInterface,
  populatedItemServingNutrition,
  populatedItemServingPriceCents,
} from "../data/interfaces";
import { ItemTypeEnum } from "../data/item-type-enum";
import {
  recursivelyPopulateSubitemsOfItems,
  RxDBItemDocument,
} from "../data/rxdb";
import { currencyFormatter } from "../utilities/currency-formatter";

export interface RangeType {
  start: Date;
  end: Date;
}

export default function LogPage() {
  const [deleteItemState, setDeleteItemState] =
    useState<RxDBItemDocument | null>(null);
  const collection = useRxCollection<RxDBItemDocument>("item");
  const [viewState, setViewState] = useState<View>("day");

  const [dateRangeState, setDateRangeState] = useState<RangeType>({
    start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  });

  const [populatedResultState, setPopulatedResultState] = useState<
    Array<ItemInterface>
  >([]);
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
  const locales = {
    "en-US": enUS,
  };

  async function calculate() {
    setPopulatedResultState(
      await recursivelyPopulateSubitemsOfItems(query.result)
    );
  }

  useEffect(() => {
    calculate();
  }, [query.result, collection]);

  const size: Size = useWindowSize();

  if (size.width < 480) {
    if (viewState !== "day") {
      setViewState("day");
    }
  } else if (size.width < 768 && viewState === "month") {
    setViewState("week");
  }

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
          onNavigate={(date, view) => {
            if (view === "day") {
              setDateRangeState({
                start: moment(date).startOf("day").toDate(),
                end: moment(date).endOf("day").toDate(),
              });
            } else if (view === "week") {
              setDateRangeState({
                start: moment(date).startOf("isoWeek").toDate(),
                end: moment(date).endOf("isoWeek").toDate(),
              });
            } else if (view === "month") {
              setDateRangeState({
                start: moment(date)
                  .startOf("month")
                  .subtract(7, "days")
                  .toDate(),
                end: moment(date).endOf("month").add(7, "days").toDate(),
              });
            } else if (view === "agenda") {
              setDateRangeState({
                start: moment(date).toDate(),
                end: moment(date).add(1, "month").toDate(),
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
            if (event.resource.id) {
              (
                await collection?.findOne(event.resource.id).exec()
              )?.recursivelyRemove();
            }
          }}
          events={populatedResultState?.map((value) => {
            const nutrition = populatedItemServingNutrition(value);
            const priceCents = populatedItemServingPriceCents(value);
            return {
              title: `${currencyFormatter.format((priceCents ?? 0) / 100)} ${
                nutrition.energyKilocalories
              }kcal`,
              start: new Date(value.date!),
              end: new Date(
                new Date(value.date!).getTime() + 0.75 * 60 * 60 * 1000
              ),
              allDay: false,
              resource: value,
            };
          })}
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
    </Fragment>
  );
}
