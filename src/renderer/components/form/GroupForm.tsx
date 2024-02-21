import { Button, Center, VStack } from "@chakra-ui/react";

import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { ItemTypeEnum } from "../../data/interfaces/ItemTypeEnum";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";
import { useTranslation } from "react-i18next";
// import { PriceNutritionGrid } from "../PriceNutritionGrid";

type GroupFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function GroupForm(props: GroupFormProps) {
  const { t } = useTranslation();
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
        placeholder={t("name")}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />

      <ValidatedFormikNumberControl
        isRequired={true}
        value={props.formikProps.values.count}
        error={props.formikProps.errors.count}
        name="count"
        placeholder={t("servings")}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group]}
        name={"subitems"}
        label={t("items")}
      />

      <Center>
        <VStack width={"full"}>
          <Button
            type="submit"
            my={4}
            isLoading={props.formikProps.isSubmitting}
          >
            {t("submit")}
          </Button>
          {/* <PriceNutritionGrid
            priceCents={totalPriceInCents}
            nutritionInfo={totalNutritionInfo}
          /> */}
        </VStack>
      </Center>
    </Form>
  );
}
