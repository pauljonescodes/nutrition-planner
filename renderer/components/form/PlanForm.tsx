import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";

type PlanFormProps = {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function PlanForm(props: PlanFormProps) {
  const formikProps = props.formikProps;
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

      <SubitemFieldArray
        formikProps={formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.recipe]}
      />

      <Center>
        <VStack>
          <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
            Submit
          </Button>
        </VStack>
      </Center>
    </Form>
  );
}
