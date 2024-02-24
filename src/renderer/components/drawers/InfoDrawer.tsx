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
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from '@chakra-ui/react';
import Datetime from 'react-datetime';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import moment from 'moment';
import { LocalStorageKeysEnum } from '../../constants';
import { calculateBasalMetabolicRateKcal } from '../../utilities/calculateBasalMetabolicRateKcal';
import { calculateEnergyTargetKcal } from '../../utilities/calculateEnergyTargetKcal';
import { calculateTotalDailyEnergyExpenditureKcal } from '../../utilities/calculateTotalDailyEnergyExpenditureKcal';
import {
  PhysicalActivityLevelEnum,
  physicalActivityLevelValueForEnum,
  enumForPhysicalActivityLevelValue,
} from '../../data/interfaces/PhysicalActivityLevelEnum';

type InfoDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function InfoDrawer(props: InfoDrawerProps) {
  const { isOpen, onClose } = props;
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

  const [
    physicalActivityLevelNumberLocalStorage,
    setPhysicalActivityLevelNumberLocalStorage,
  ] = useLocalStorage<number | undefined>(
    LocalStorageKeysEnum.physicalActivityLevelNumber,
    1.4,
  );

  const basalMetabolicRateKcal = calculateBasalMetabolicRateKcal({
    sexIsMale: sexLocalStorage === 'male',
    weightKilograms: weightKilogramsLocalStorage,
    heightCentimeters: heightCentimetersLocalStorage,
    ageYears: moment().diff(birthdayLocalStorage, 'years'),
  });
  const totalDailyEnergyExpenditureKcal =
    calculateTotalDailyEnergyExpenditureKcal({
      weightKilograms: weightKilogramsLocalStorage,
      sexIsMale: sexLocalStorage === 'male',
      ageYears: moment().diff(birthdayLocalStorage, 'years'),
      heightCentimeters: heightCentimetersLocalStorage,
      physicalActivityLevelNumber: physicalActivityLevelNumberLocalStorage,
    });
  const energyTargetKcal = calculateEnergyTargetKcal({
    weightKilograms: weightKilogramsLocalStorage,
    sexIsMale: sexLocalStorage === 'male',
    ageYears: moment().diff(birthdayLocalStorage, 'years'),
    heightCentimeters: heightCentimetersLocalStorage,
    goalWeightKilograms: goalWeightKilogramsLocalStorage,
    goalDays: moment(goalDateLocalStorage).diff(moment(), 'days'),
    physicalActivityLevelNumber: physicalActivityLevelNumberLocalStorage,
  });

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="md"
      onClose={onClose}
      finalFocusRef={undefined}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t('info')}</DrawerHeader>
        <DrawerBody>
          <VStack alignItems="start">
            <StatGroup width="full" textAlign="center">
              <Stat>
                <StatLabel>{t('targetEnergy')}</StatLabel>
                <StatNumber>
                  {energyTargetKcal ? `~${Math.round(energyTargetKcal)}` : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('kcal')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>{t('totalEnergy')}</StatLabel>
                <StatNumber>
                  {totalDailyEnergyExpenditureKcal
                    ? Math.round(totalDailyEnergyExpenditureKcal)
                    : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('kcal')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>{t('baseEnergy')}</StatLabel>
                <StatNumber>
                  {basalMetabolicRateKcal
                    ? Math.round(basalMetabolicRateKcal)
                    : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('kcal')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
              </Stat>
            </StatGroup>
            <StatGroup width="full" textAlign="center">
              <Stat>
                <StatLabel>{t('fatTarget')}</StatLabel>
                <StatNumber>
                  {energyTargetKcal && dietaryFatPercentLocalStorage
                    ? `~${Math.round(
                        (energyTargetKcal *
                          (dietaryFatPercentLocalStorage / 100)) /
                          9,
                      )}`
                    : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('grams')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>{t('carbohydrateTarget')}</StatLabel>
                <StatNumber>
                  {energyTargetKcal && dietaryCarbohydratePercentLocalStorage
                    ? `~${Math.round(
                        (energyTargetKcal *
                          (dietaryCarbohydratePercentLocalStorage / 100)) /
                          4,
                      )}`
                    : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('grams')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>{t('proteinTarget')}</StatLabel>
                <StatNumber>
                  {energyTargetKcal && dietaryProteinPercentLocalStorage
                    ? `~${Math.round(
                        (energyTargetKcal *
                          (dietaryProteinPercentLocalStorage / 100)) /
                          4,
                      )}`
                    : 'NA'}
                </StatNumber>
                <StatHelpText>
                  {t('grams')} / {t('day').toLocaleLowerCase()}
                </StatHelpText>
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
              initialViewMode="years"
              value={
                birthdayLocalStorage
                  ? new Date(birthdayLocalStorage)
                  : undefined
              }
              onChange={(value) => {
                let formattedValue = value;
                if (moment.isMoment(value)) {
                  formattedValue = value.toISOString();
                }
                setBirthdayLocalStorage(formattedValue as string);
              }}
            />

            <FormLabel>
              {t('weight')} ({t('kgKilograms')})
            </FormLabel>
            <NumberInput
              width="full"
              value={weightKilogramsLocalStorage ?? 0}
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

            <FormLabel>
              {t('height')} ({t('cmCentimeters')})
            </FormLabel>
            <NumberInput
              width="full"
              value={heightCentimetersLocalStorage ?? 0}
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

            <FormLabel>
              {t('goalWeight')} ({t('kgKilograms')})
            </FormLabel>
            <NumberInput
              width="full"
              value={goalWeightKilogramsLocalStorage ?? 0}
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
              value={
                goalDateLocalStorage
                  ? new Date(goalDateLocalStorage)
                  : undefined
              }
              onChange={(value) => {
                let formattedValue = value;
                if (moment.isMoment(value)) {
                  formattedValue = value.toISOString();
                }
                setGoalDateLocalStorage(formattedValue as string);
              }}
            />
            <FormLabel>{t('physicalActivityLevel')}</FormLabel>
            <Select
              value={enumForPhysicalActivityLevelValue(
                physicalActivityLevelNumberLocalStorage,
              )}
              onChange={(event) => {
                const enumValue: PhysicalActivityLevelEnum = event.target
                  .value as PhysicalActivityLevelEnum;
                const value: number =
                  physicalActivityLevelValueForEnum(enumValue);
                setPhysicalActivityLevelNumberLocalStorage(value);
              }}
            >
              {Object.values(PhysicalActivityLevelEnum).map((value: string) => (
                <option value={value} key={value}>
                  {t(value)}
                </option>
              ))}
            </Select>
            <FormLabel>{t('dietaryFatPercent')}</FormLabel>
            <Flex width="full">
              <NumberInput
                width="full"
                value={dietaryFatPercentLocalStorage ?? 0}
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
            <Flex width="full">
              <NumberInput
                width="full"
                value={dietaryCarbohydratePercentLocalStorage ?? 0}
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
            <Flex width="full">
              <NumberInput
                width="full"
                value={dietaryProteinPercentLocalStorage ?? 0}
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
  );
}
