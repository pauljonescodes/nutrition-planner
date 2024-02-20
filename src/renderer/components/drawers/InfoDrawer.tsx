import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import Datetime from 'react-datetime';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../../constants';
import moment from 'moment';
import {
  calculateBasalMetabolicRateKcal,
  calculateEnergyTargetKcal,
} from '../../data/CalculationHelpers';

type InfoDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function InfoDrawer(props: InfoDrawerProps) {
  const { t } = useTranslation();

  const [sexLocalStorage, setSexLocalStorage] = useLocalStorage<
    string | undefined
  >(LocalStorageKeysEnum.sex, undefined);

  const [birthdayLocalStorage, setBirthdayLocalStorage] = useLocalStorage<
    string | undefined
  >(LocalStorageKeysEnum.birthday, undefined);

  const [weightKilogramsLocalStorage, setWeightKilogramsLocalStorage] =
    useLocalStorage<number | undefined>(
      LocalStorageKeysEnum.weightKilograms,
      undefined,
    );

  const [heightCentimetersLocalStorage, setHeightCentimetersLocalStorage] =
    useLocalStorage<number | undefined>(
      LocalStorageKeysEnum.heightCentimeters,
      undefined,
    );

  const [goalWeightKilogramsLocalStorage, setGoalWeightKilogramsLocalStorage] =
    useLocalStorage<number | undefined>(
      LocalStorageKeysEnum.goalWeightKilograms,
      undefined,
    );

  const [goalDateLocalStorage, setGoalDateLocalStorage] = useLocalStorage<
    string | undefined
  >(LocalStorageKeysEnum.goalDate, undefined);

  const [dietaryFatPercentLocalStorage, setDietaryFatPercentLocalStorage] =
    useLocalStorage<number | undefined>(
      LocalStorageKeysEnum.dietaryFatPercent,
      40,
    );

  const [
    dietaryCarbohydratePercentLocalStorage,
    setDietaryCarbohydratePercentLocalStorage,
  ] = useLocalStorage<number | undefined>(
    LocalStorageKeysEnum.dietaryCarbohydratePercent,
    20,
  );

  const [
    dietaryProteinPercentLocalStorage,
    setDietaryProteinPercentLocalStorage,
  ] = useLocalStorage<number | undefined>(
    LocalStorageKeysEnum.dietaryProteinPercent,
    40,
  );

  const basalMetabolicRate = calculateBasalMetabolicRateKcal({
    sexIsMale: sexLocalStorage == 'male',
    weightKilograms: weightKilogramsLocalStorage,
    heightCentimeters: heightCentimetersLocalStorage,
    ageYears: moment().diff(birthdayLocalStorage, 'years'),
  });
  const energyTarget = calculateEnergyTargetKcal({
    weightKilograms: weightKilogramsLocalStorage,
    sexIsMale: sexLocalStorage == 'male',
    ageYears: moment().diff(birthdayLocalStorage, 'years'),
    heightCentimeters: heightCentimetersLocalStorage,
    goalWeightKilograms: goalWeightKilogramsLocalStorage,
    goalDays: moment(goalDateLocalStorage).diff(moment(), 'days'),
  });

  return (
    <Fragment>
      <Drawer
        isOpen={props.isOpen}
        placement="right"
        size="md"
        onClose={props.onClose}
        finalFocusRef={undefined}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('info')}</DrawerHeader>
          <DrawerBody>
            <VStack alignItems={'start'}>
              <StatGroup width={'full'} textAlign={"center"}>
                <Stat>
                  <StatLabel>{t('energyTarget')}</StatLabel>
                  <StatNumber>
                    {energyTarget ? Math.round(energyTarget) : 'NA'}
                  </StatNumber>
                  <StatHelpText>{t("kcal")}</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>{t('basalMetabolicRate')}</StatLabel>
                  <StatNumber>
                    {basalMetabolicRate ? Math.round(basalMetabolicRate) : 'NA'}
                  </StatNumber>
                  <StatHelpText>{t("kcal")}</StatHelpText>
                </Stat>
                
              </StatGroup >
              <StatGroup width={'full'} textAlign={"center"}>
                <Stat>
                  <StatLabel>{t('fatTarget')}</StatLabel>
                  <StatNumber>
                    {energyTarget && dietaryFatPercentLocalStorage
                      ? Math.round((energyTarget * (dietaryFatPercentLocalStorage/100))/9)
                      : 'NA'}
                  </StatNumber>
                  <StatHelpText>{t("grams")}</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>{t('carbohydrateTarget')}</StatLabel>
                  <StatNumber>{energyTarget && dietaryCarbohydratePercentLocalStorage
                      ? Math.round((energyTarget * (dietaryCarbohydratePercentLocalStorage/100))/4)
                      : 'NA'}</StatNumber>
                      <StatHelpText>{t("grams")}</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>{t('proteinTarget')}</StatLabel>
                  <StatNumber>{energyTarget && dietaryProteinPercentLocalStorage
                      ? Math.round((energyTarget * (dietaryProteinPercentLocalStorage/100))/4)
                      : 'NA'}</StatNumber>
                      <StatHelpText>{t("grams")}</StatHelpText>
                </Stat>
              </StatGroup>

              <FormLabel>{t('sex')}</FormLabel>
              <Select
                value={sexLocalStorage}
                onChange={(event) => setSexLocalStorage(event.target.value)}
                placeholder={t('sex')}
              >
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
              </Select>

              <FormLabel>{t('birthday')}</FormLabel>
              <Datetime
                closeOnSelect
                className="rdt-full-width"
                value={new Date(birthdayLocalStorage)}
                onChange={(value) => {
                  let formattedValue = value;
                  if (moment.isMoment(value)) {
                    formattedValue = value.toISOString();
                  }
                  setBirthdayLocalStorage(formattedValue);
                }}
              />

              <FormLabel>{t('weight')} ({t("kgKilograms")})</FormLabel>
              <NumberInput
                width={'full'}
                value={weightKilogramsLocalStorage}
                onChange={(value, valueAsNumber) =>
                  setWeightKilogramsLocalStorage(valueAsNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>{t('height')} ({t("cmCentimeters")})</FormLabel>
              <NumberInput
                width={'full'}
                value={heightCentimetersLocalStorage}
                onChange={(value, valueAsNumber) =>
                  setHeightCentimetersLocalStorage(valueAsNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>{t('goalWeight')} ({t("kgKilograms")})</FormLabel>
              <NumberInput
                width={'full'}
                value={goalWeightKilogramsLocalStorage}
                onChange={(value, valueAsNumber) =>
                  setGoalWeightKilogramsLocalStorage(valueAsNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>{t('goalDate')}</FormLabel>
              <Datetime
                closeOnSelect
                className="rdt-full-width"
                value={new Date(goalDateLocalStorage)}
                onChange={(value) => {
                  let formattedValue = value;
                  if (moment.isMoment(value)) {
                    formattedValue = value.toISOString();
                  }
                  setGoalDateLocalStorage(formattedValue);
                }}
              />

              <FormLabel>{t('dietaryFatPercent')}</FormLabel>
              <Flex width={'full'}>
                <NumberInput
                  width={'full'}
                  value={dietaryFatPercentLocalStorage}
                  onChange={(value, valueAsNumber) =>
                    setDietaryFatPercentLocalStorage(valueAsNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <FormLabel>{t('dietaryCarbohydratePercent')}</FormLabel>
              <Flex width={'full'}>
                <NumberInput
                  width={'full'}
                  value={dietaryCarbohydratePercentLocalStorage}
                  onChange={(value, valueAsNumber) =>
                    setDietaryCarbohydratePercentLocalStorage(valueAsNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <FormLabel>{t('dietaryProteinPercent')}</FormLabel>
              <Flex width={'full'}>
                <NumberInput
                  width={'full'}
                  value={dietaryProteinPercentLocalStorage}
                  onChange={(value, valueAsNumber) =>
                    setDietaryProteinPercentLocalStorage(valueAsNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
