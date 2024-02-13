import { Button, Center, VStack } from "@chakra-ui/react";

import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";

type GroupFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function GroupForm(props: GroupFormProps) {
  return (
    <Form
      noValidate={true}
      onSubmit={(e) => {
        e.preventDefault();
        props.formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
      }}
    >
      <ValidatedFormikControl
        value={props.formikProps.values.name}
        error={props.formikProps.errors.name}
        isRequired={true}
        name="name"
        placeholder="Name"
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />

      <ValidatedFormikNumberControl
        isRequired={true}
        value={props.formikProps.values.count}
        error={props.formikProps.errors.count}
        name="count"
        placeholder="Servings"
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group]}
        name={""}
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
