import { Box, useColorModeValue } from "@chakra-ui/react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Fragment, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { BigCalendarChakraToolbar } from "../components/BigCalendarChakraToolbar";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { CalculationTypeEnum } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";

export default function LogPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setEditItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const [calculationType, setCalculationType] = useState<CalculationTypeEnum>(
    CalculationTypeEnum.perServing
  );

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
      <Box
        minHeight="calc(100vh - 64px)"
        px={3}
        sx={{
          ".rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row, .rbc-month-view, .rbc-header":
            {
              borderColor: "var(--chakra-colors-chakra-border-color)",
            },
          ".rbc-off-range-bg": { bg: offRangeBg },
          ".rbc-toolbar button": {
            color: "var(--chakra-colors-chakra-body-text)",
            backgroundColor: "transparent",
            boxShadow: "none !imporant;",
          },
          ".rbc-today": {
            bg: todayBg,
          },
        }}
      >
        <Calendar
          selectable
          localizer={localizer}
          events={[]}
          views={{ day: true, month: true, week: true }}
          startAccessor="start"
          endAccessor="end"
          style={{ minHeight: "calc(100vh - 64px - 24px)" }}
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
