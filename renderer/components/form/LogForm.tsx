import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, Fragment, RefObject, useState } from "react";
import { ItemInterface } from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedDatetimeControl } from "../form-controls/ValidatedDateTimeControl";

type LogFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
  onDelete?: (item: ItemInterface | null) => void;
};

export default function LogForm(props: LogFormProps) {
  const [showDeleteState, setShowDeleteState] = useState<boolean>(false);
  return (
    <Fragment>
      <Form
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault();
          props.formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
          console.log(props.formikProps.errors);
        }}
      >
        <ValidatedDatetimeControl
          isRequired={true}
          value={props.formikProps.values.date}
          error={props.formikProps.errors.date}
          name="date"
          placeholder="Date"
          formikProps={props.formikProps}
          spaceProps={{ pb: 2 }}
        />

        <SubitemFieldArray
          formikProps={props.formikProps}
          itemTypesIn={[
            ItemTypeEnum.item,
            ItemTypeEnum.group,
            ItemTypeEnum.plan,
          ]}
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
            {props.onDelete && (
              <Button
                colorScheme="red"
                my={4}
                isLoading={props.formikProps.isSubmitting}
                onClick={() => setShowDeleteState(true)}
              >
                Delete
              </Button>
            )}
          </VStack>
        </Center>
      </Form>
      <DeleteAlertDialog
        isOpen={showDeleteState}
        onResult={async (result: boolean) => {
          setShowDeleteState(false);
          if (result && props.onDelete) {
            props.onDelete(props.formikProps.values);
          }
        }}
      />
    </Fragment>
  );
}
