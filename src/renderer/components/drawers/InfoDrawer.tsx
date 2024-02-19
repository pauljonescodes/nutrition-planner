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
  StatLabel,
  StatNumber,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import Datetime from 'react-datetime';
import { useRxDB } from 'rxdb-hooks';

type InfoDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function InfoDrawer(props: InfoDrawerProps) {
  const database = useRxDB();
  //const collection = useRxCollection("item");
  const toast = useToast();

  const subtleTextColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

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
          <DrawerHeader>Info</DrawerHeader>
          <DrawerBody>
            <VStack alignItems={'start'}>
              <StatGroup width={'full'}>
                <Stat>
                  <StatLabel>Energy target (kcal)</StatLabel>
                  <StatNumber>2,800</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Basal Metabolic Rate (kcal)</StatLabel>
                  <StatNumber>3,100</StatNumber>
                </Stat>
              </StatGroup>
              <StatGroup width={'full'}>
                <Stat>
                  <StatLabel>Fat target (g)</StatLabel>
                  <StatNumber>100 </StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Carb target (g)</StatLabel>
                  <StatNumber>100</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Protein target (g)</StatLabel>
                  <StatNumber>150</StatNumber>
                </Stat>
              </StatGroup>

              <FormLabel>Sex</FormLabel>
              <Select>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>

              <FormLabel>Birthday</FormLabel>
              <Datetime closeOnSelect className="rdt-full-width" />

              <FormLabel>Weight (kg)</FormLabel>
              <NumberInput width={'full'}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Height (cm)</FormLabel>
              <NumberInput width={'full'}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Goal weight (kg)</FormLabel>
              <NumberInput width={'full'}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Goal date</FormLabel>
              <Datetime closeOnSelect className="rdt-full-width" />
              
              <FormLabel>Dietary fat percent</FormLabel>
              <Flex width={'full'}>
                <NumberInput maxW="100px" mr="2rem">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Slider flex="1" focusThumbOnChange={false}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
              <FormLabel>Dietary carbohydrates percent</FormLabel>
              <Flex width={'full'}>
                <NumberInput maxW="100px" mr="2rem">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Slider flex="1" focusThumbOnChange={false}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
              <FormLabel>Dietary protein percent</FormLabel>
              <Flex width={'full'}>
                <NumberInput maxW="100px" mr="2rem">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Slider flex="1" focusThumbOnChange={false}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
