import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { ItemTypeEnum } from "../../data/interfaces/ItemTypeEnum";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { useTranslation } from "react-i18next";

type PlanFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function PlanForm(props: PlanFormProps) {
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
        isRequired={true}
        value={props.formikProps.values.name}
        error={props.formikProps.errors.name}
        name="name"
        placeholder={t("name")}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group]}
        name={t("count")}
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
