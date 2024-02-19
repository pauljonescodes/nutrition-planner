import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  VStack,
  Select,
  useColorMode,
  FormLabel,
  useColorModeValue,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import FileSaver from 'file-saver';
import { Fragment, useEffect, useState } from 'react';
import { useRxCollection, useRxDB } from 'rxdb-hooks';
import { useFilePicker } from 'use-file-picker';
import { DeleteAlertDialog } from '../DeleteAlertDialog';
import Datetime from 'react-datetime';

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
            <VStack>
              <StatGroup width={"full"}>
                <Stat>
                  <StatLabel>Energy target (kcal)</StatLabel>
                  <StatNumber>2,800 </StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Basal Metabolic Rate (kcal)</StatLabel>
                  <StatNumber>3,100</StatNumber>
                </Stat>
              </StatGroup>
              <StatGroup width={"full"}>
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
              <Datetime closeOnSelect className='rdt-full-width'/>

              <FormLabel>Weight (kg)</FormLabel>
              <NumberInput width={"full"}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Height (cm)</FormLabel>
              <NumberInput width={"full"}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Goal weight (kg)</FormLabel>
              <NumberInput width={"full"}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Goal days</FormLabel>
              <NumberInput width={"full"}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
