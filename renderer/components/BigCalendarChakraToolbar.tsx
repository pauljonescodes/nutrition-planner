import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { ToolbarProps } from "react-big-calendar";

export const BigCalendarChakraToolbar = (toolbar: ToolbarProps) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setFullYear(now.getFullYear());
    toolbar.onNavigate("TODAY");
  };

  const label = () => {
    const date = new Date();
    return (
      <span>
        <b>{date.toISOString()}</b>
      </span>
    );
  };

  return (
    <HStack>
      <ButtonGroup isAttached pb={3} pt={3}>
        <IconButton
          onClick={goToBack}
          icon={<ArrowBackIcon />}
          aria-label={"Back"}
          variant="outline"
        />
        <Button onClick={goToCurrent} variant="outline">
          Today
        </Button>
        <IconButton
          onClick={goToNext}
          icon={<ArrowForwardIcon />}
          aria-label={"Next"}
          variant="outline"
        />
      </ButtonGroup>
      <Spacer />
      <ButtonGroup isAttached pb={3} pt={3}>
        <Button onClick={() => toolbar.onView("day")} variant="outline">
          Day
        </Button>
        <Button onClick={() => toolbar.onView("week")} variant="outline">
          Week
        </Button>
        <Button onClick={() => toolbar.onView("month")} variant="outline">
          Month
        </Button>
      </ButtonGroup>
    </HStack>
  );
};
