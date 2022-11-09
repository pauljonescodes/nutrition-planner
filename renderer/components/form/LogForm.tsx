import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { yupItemSchema } from "../../data/yup-schema";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedDatetimeControl } from "../form-controls/ValidatedDateTimeControl";

type LogFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function LogForm(props: LogFormProps) {
  return (
    <Form
      noValidate={true}
      onSubmit={(e) => {
        e.preventDefault();
        props.formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
        console.log(props.formikProps.errors);
      }}
    >
      <ValidatedDatetimeControl
        value={props.formikProps.values.date}
        error={props.formikProps.errors.date}
        yupSchemaField={yupItemSchema.fields.date}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group, ItemTypeEnum.plan]}
      />

      <Center>
        <VStack width={"full"}>
          <Button
            type="submit"
            my={4}
            isLoading={props.formikProps.isSubmitting}
          >
            Submit
          </Button>
        </VStack>
      </Center>
    </Form>
  );
}
