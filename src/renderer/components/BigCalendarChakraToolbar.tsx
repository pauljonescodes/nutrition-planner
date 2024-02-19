import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  Show,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { ToolbarProps } from "react-big-calendar";
import { dateIsToday } from "../utilities/dateIsToday";

export const BigCalendarChakraToolbar = (toolbar: ToolbarProps) => {
  return (
    <HStack>
      <ButtonGroup
        isAttached
        pb={3}
        pt={3}
        width={{ base: "full", sm: "initial" }}
      >
        <IconButton
          onClick={() => toolbar.onNavigate("PREV")}
          icon={<ArrowBackIcon />}
          aria-label={"Back"}
          variant="outline"
          flexGrow={{ base: 1, sm: "initial" }}
        />
        <Button
          onClick={() => toolbar.onNavigate("TODAY")}
          variant="outline"
          flexGrow={{ base: 1, sm: "initial" }}
          isActive={dateIsToday(toolbar.date)}
        >
          <Show below="sm">{toolbar.label}</Show>
          <Show above="sm">Today</Show>
        </Button>
        <IconButton
          flexGrow={{ base: 1, sm: "initial" }}
          onClick={() => toolbar.onNavigate("NEXT")}
          icon={<ArrowForwardIcon />}
          aria-label={"Next"}
          variant="outline"
        />
      </ButtonGroup>
      <Show above="sm">
        <Spacer />
      </Show>
      <Show above="sm">
        <Center>
          <Text>{toolbar.label}</Text>
        </Center>
      </Show>
      <Show above="sm">
        <Spacer />
        <ButtonGroup isAttached pb={3} pt={3}>
          <Button
            onClick={() => toolbar.onView("day")}
            variant="outline"
            isActive={toolbar.view === "day"}
          >
            Day
          </Button>
          <Button
            onClick={() => toolbar.onView("week")}
            variant="outline"
            isActive={toolbar.view === "week"}
          >
            Week
          </Button>
          <Show above="md">
            <Button
              onClick={() => toolbar.onView("month")}
              variant="outline"
              isActive={toolbar.view === "month"}
            >
              Month
            </Button>
          </Show>
        </ButtonGroup>
      </Show>
    </HStack>
  );
};