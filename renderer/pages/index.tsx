import { Box, useColorModeValue } from "@chakra-ui/react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Size } from "electron";
import moment from "moment";
import { Fragment, useState } from "react";
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
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";

export interface RangeType {
  start: Date;
  end: Date;
}

export default function LogPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const [viewState, setViewState] = useState<View>("day");

  const [dateRangeState, setDateRangeState] = useState<RangeType>({
    start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  });

  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.log,
        date: {
          $lt: dateRangeState.end.toISOString(),
          $gt: dateRangeState.start.toISOString(),
        },
      },
    })!,
    {
      pageSize: 12,
      pagination: "Infinite",
    }
  );
  const locales = {
    "en-US": enUS,
  };

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

  const offRangeBg = useColorModeValue("gray.100", "gray.700");
  const todayBg = useColorModeValue(
    "rgba(49, 130, 206, 0.12)",
    "rgba(49, 130, 206, 0.12)"
  );

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
          events={
            // {
            //   title: "Workout day plan",
            //   start: new Date(2022, 10, 4, 12, 0, 0),
            //   end: new Date(2022, 10, 4, 13, 0, 0),
            // },
            result.map((value) => {
              return {
                title: "",
                start: new Date(value.date),
                end: new Date(
                  new Date(value.date).getTime() + 0.5 * 60 * 60 * 1000
                ),
                allDay: false,
              };
            })
          }
          views={{ day: true, month: true, week: true }}
          startAccessor="start"
          endAccessor="end"
          components={{
            toolbar: BigCalendarChakraToolbar,
          }}
        />
      </Box>
      <DeleteAlertDialog
        isOpen={deleteItem !== null}
        onResult={async (result: boolean) => {
          if (result) {
            deleteItem?.remove();
          }
          setDeleteItem(null);
        }}
      />
    </Fragment>
  );
}
