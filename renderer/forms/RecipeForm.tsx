import {
  Button,
  Center,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { FormEvent, RefObject } from "react";
import { ValidatedFormikControlInput } from "../components/ValidatedFormikControlInput";
import { ValidatedFormikControlNumberInput } from "../components/ValidatedFormikControlNumberInput";
import { Database } from "../data/Database";
import { ItemInferredType, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { nutritionInfoDescription } from "../data/NutritionInfo";
import { ItemInItemFieldArray } from "./ItemInItem/FieldArray";

export interface RecipeFormProps {
  item?: ItemInferredType;
  onSubmit: (item: ItemInferredType) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function RecipeForm(props: RecipeFormProps) {
  const thisItemId = props.item?.id ?? nanoid();
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Formik<ItemInferredType>
      initialValues={{
        ...yupItemSchema.getDefault(),
        ...props.item,
        type: ItemType.recipe,
        id: thisItemId,
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values as ItemInferredType);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <Form
            noValidate={true}
            onSubmit={(e) => {
              e.preventDefault();
              formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
            }}
          >
            <ValidatedFormikControlInput
              value={formikProps.values.name}
              error={formikProps.errors.name}
              yupSchemaField={yupItemSchema.fields.name}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
              inputFieldRef={props.firstInputFieldRef}
            />

            <ValidatedFormikControlNumberInput
              value={formikProps.values.count}
              error={formikProps.errors.count}
              yupSchemaField={yupItemSchema.fields.count}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />

            <ItemInItemFieldArray
              thisItemId={thisItemId}
              formikProps={formikProps}
            />

            <Center>
              <VStack>
                <Button
                  type="submit"
                  my={4}
                  isLoading={formikProps.isSubmitting}
                >
                  Submit
                </Button>
                <Text
                  color={alphaColor}
                  fontSize="sm"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {nutritionInfoDescription(
                    Database.shared().itemNutrition(
                      formikProps.values as ItemInferredType,
                      true
                    )
                  )}
                </Text>
                <Text
                  color={alphaColor}
                  fontSize="sm"
                  pb={3}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {Database.shared().formattedItemPrice(
                    formikProps.values as ItemInferredType,
                    true
                  )}{" "}
                  per serving /{" "}
                  {Database.shared().formattedItemPrice(
                    formikProps.values as ItemInferredType,
                    false
                  )}{" "}
                  total
                </Text>
              </VStack>
            </Center>
          </Form>
        );
      }}
    />
  );
}
