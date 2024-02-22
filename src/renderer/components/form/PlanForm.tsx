import { Button, Center, VStack } from '@chakra-ui/react';
import { Form, FormikProps } from 'formik';
import { FormEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { SubitemFieldArray } from '../form-controls/SubitemFieldArray';
import { ValidatedFormikControl } from '../form-controls/ValidatedFormikControl';

type PlanFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function PlanForm(props: PlanFormProps) {
  const { formikProps, firstInputFieldRef } = props;
  const { t } = useTranslation();

  return (
    <Form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
      }}
    >
      <ValidatedFormikControl
        isRequired
        value={formikProps.values.name}
        error={formikProps.errors.name}
        name="name"
        placeholder={t('name')}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={firstInputFieldRef}
      />

      <SubitemFieldArray
        formikProps={formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group, ItemTypeEnum.plan]}
        name="subitems"
        label={t('items')}
      />

      <Center>
        <VStack width="full">
          <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
            {t('submit')}
          </Button>
        </VStack>
      </Center>
    </Form>
  );
}
