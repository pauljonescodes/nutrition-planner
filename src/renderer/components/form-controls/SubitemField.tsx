import { AddIcon } from "@chakra-ui/icons";
import { Button, Center, FormLabel, VStack } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { SubitemAutoCompleteInput } from "./SubitemAutoCompleteInput";

interface SubitemFieldProps {
  formikProps: FormikProps<ItemInterface>;
  fieldArrayHelpers: FieldArrayRenderProps;
  itemTypesIn: Array<ItemTypeEnum>;
  name: string;
}

export function SubitemField(props: SubitemFieldProps) {
  return (
    <VStack spacing={0} pb={2}>
      <FormLabel>{props.name}</FormLabel>
      {props.formikProps.values.subitems?.map((value, index) => {
        return (
          <SubitemAutoCompleteInput
            key={`${index}-${value.itemId}`}
            value={value!}
            index={index}
            itemTypesIn={props.itemTypesIn}
            formikProps={props.formikProps}
            fieldArrayHelpers={props.fieldArrayHelpers}
          />
        );
      })}
      <Center>
        <Button
          onClick={async () => {
            props.fieldArrayHelpers.push({
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
