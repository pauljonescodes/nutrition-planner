import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  Show,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { ToolbarProps } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { dateIsToday } from '../utilities/dateIsToday';

export function BigCalendarChakraToolbar(props: ToolbarProps) {
  const { onNavigate, date, label, view, onView } = props;
  const { t } = useTranslation();
  return (
    <HStack>
      <ButtonGroup
        isAttached
        pb={3}
        pt={3}
        width={{ base: 'full', sm: 'initial' }}
      >
        <IconButton
          onClick={() => onNavigate('PREV')}
          icon={<ArrowBackIcon />}
          aria-label={t('previous')}
          variant="outline"
          flexGrow={{ base: 1, sm: 'initial' }}
        />
        <Button
          onClick={() => onNavigate('TODAY')}
          variant="outline"
          flexGrow={{ base: 1, sm: 'initial' }}
          isActive={dateIsToday(date)}
        >
          <Show below="sm">{label}</Show>
          <Show above="sm">{t('today')}</Show>
        </Button>
        <IconButton
          flexGrow={{ base: 1, sm: 'initial' }}
          onClick={() => onNavigate('NEXT')}
          icon={<ArrowForwardIcon />}
          aria-label={t('next')}
          variant="outline"
        />
      </ButtonGroup>
      <Show above="sm">
        <Spacer />
      </Show>
      <Show above="sm">
        <Center>
          <Text>{label}</Text>
        </Center>
      </Show>
      <Show above="sm">
        <Spacer />
        <ButtonGroup isAttached pb={3} pt={3}>
          <Button
            onClick={() => onView('day')}
            variant="outline"
            isActive={view === 'day'}
          >
            {t('day')}
          </Button>
          <Button
            onClick={() => onView('week')}
            variant="outline"
            isActive={view === 'week'}
          >
            {t('week')}
          </Button>
          <Show above="md">
            <Button
              onClick={() => onView('month')}
              variant="outline"
              isActive={view === 'month'}
            >
              {t('month')}
            </Button>
          </Show>
        </ButtonGroup>
      </Show>
    </HStack>
  );
}
