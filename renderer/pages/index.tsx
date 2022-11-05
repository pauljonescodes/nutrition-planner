import { Box, useColorModeValue } from "@chakra-ui/react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Size } from "electron";
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

export default function LogPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const [viewState, setViewState] = useState<View>("day");

  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.item,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
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
            [
              // {
              //   title: "Workout day plan",
              //   start: new Date(2022, 10, 4, 12, 0, 0),
              //   end: new Date(2022, 10, 4, 13, 0, 0),
              // },
            ]
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
