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
import { useTranslation } from 'react-i18next';

export const BigCalendarChakraToolbar = (toolbar: ToolbarProps) => {
  const { t } = useTranslation();
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
          aria-label={t("previous")}
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
          <Show above="sm">{t("today")}</Show>
        </Button>
        <IconButton
          flexGrow={{ base: 1, sm: "initial" }}
          onClick={() => toolbar.onNavigate("NEXT")}
          icon={<ArrowForwardIcon />}
          aria-label={t("next")}
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
            {t("day")}
          </Button>
          <Button
            onClick={() => toolbar.onView("week")}
            variant="outline"
            isActive={toolbar.view === "week"}
          >
             {t("week")}
          </Button>
          <Show above="md">
            <Button
              onClick={() => toolbar.onView("month")}
              variant="outline"
              isActive={toolbar.view === "month"}
            >
               {t("month")}
            </Button>
          </Show>
        </ButtonGroup>
      </Show>
    </HStack>
  );
};