import { AddIcon } from '@chakra-ui/icons';
import { Button, Center, FormLabel, VStack } from '@chakra-ui/react';
import { FieldArrayRenderProps, FormikProps } from 'formik';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { SubitemAutoCompleteInput } from './SubitemAutoCompleteInput';

interface SubitemFieldProps {
  formikProps: FormikProps<ItemInterface>;
  fieldArrayHelpers: FieldArrayRenderProps;
  itemTypesIn: Array<ItemTypeEnum>;
  label: string;
}

export function SubitemField(props: SubitemFieldProps) {
  const { formikProps, fieldArrayHelpers, itemTypesIn, label } = props;
  return (
    <VStack spacing={0} pb={2}>
      <FormLabel>{label}</FormLabel>
      {formikProps.values.subitems?.map((value, index) => {
        return (
          <SubitemAutoCompleteInput
            key={`${value.itemId}`}
            value={value}
            index={index}
            itemTypesIn={itemTypesIn}
            formikProps={formikProps}
            fieldArrayHelpers={fieldArrayHelpers}
          />
        );
      })}
      <Center>
        <Button
          onClick={async () => {
            fieldArrayHelpers.push({
              count: 1,
            });
          }}
        >
          <AddIcon />
        </Button>
      </Center>
    </VStack>
  );
}
