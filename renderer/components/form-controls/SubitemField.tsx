import { AddIcon } from "@chakra-ui/icons";
import { Button, Center, FormLabel, VStack } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemAutoCompleteInput } from "./SubitemAutoCompleteInput";

interface SubitemFieldProps {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  fieldArrayHelpers: FieldArrayRenderProps;
}

export function SubitemField(props: SubitemFieldProps) {
  const [nameSearch, setNameSearch] = useState("");
  const { result } = useRxQuery(
    useRxCollection<ItemDocument>("item")?.find({
      selector: {
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: 6,
      pagination: "Traditional",
    }
  );

  return (
    <VStack spacing={0} pb={2}>
      <FormLabel>{yupItemSchema.fields.subitems.spec.label}</FormLabel>
      {props.formikProps.values.subitems?.map((value, index) => {
        return (
          <SubitemAutoCompleteInput
            autoCompleteOnChange={async (value) => {
              setNameSearch(value);
            }}
            value={value!}
            index={index}
            formikProps={props.formikProps}
            fieldArrayHelpers={props.fieldArrayHelpers}
            options={result}
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
