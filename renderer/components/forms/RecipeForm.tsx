import {
  Alert,
  AlertDescription,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormEvent, RefObject } from "react";
import { dataid } from "../../data/dataid";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { ItemInItemFieldArray } from "../form-controls/item-in-item/ItemInItemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";

export interface RecipeFormProps {
  item: Partial<ItemInferredType> | null;
  onSubmit: (item: Partial<ItemInferredType>) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function RecipeForm(props: RecipeFormProps) {
  const thisItemId = props.item?.id ?? dataid();
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Formik<Partial<ItemInferredType>>
      initialValues={{
        ...yupItemSchema.getDefault(),
        type: ItemTypeEnum.recipe,
        name: props.item?.name,
        count: props.item?.count,
        priceCents: 0,
        massGrams: 0,
        energyKilocalorie: 0,
        fatGrams: 0,
        carbohydrateGrams: 0,
        proteinGrams: 0,
        subitems: props.item?.subitems,
        id: thisItemId,
      }}
      validationSchema={yupItemSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values);
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
            <ValidatedFormikControl
              value={formikProps.values.name}
              error={formikProps.errors.name}
              yupSchemaField={yupItemSchema.fields.name}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
              inputFieldRef={props.firstInputFieldRef}
            />

            <ValidatedFormikNumberControl
              value={formikProps.values.count}
              error={formikProps.errors.count}
              yupSchemaField={yupItemSchema.fields.count}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ItemInItemFieldArray formikProps={formikProps} />
            <VStack>
              {Object.values(formikProps.errors).map((value) => (
                <Alert status="error">
                  <AlertDescription>{value}</AlertDescription>
                </Alert>
              ))}
            </VStack>
          </Form>
        );
      }}
    />
  );
}
