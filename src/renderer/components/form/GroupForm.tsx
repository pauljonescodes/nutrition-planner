import { Button, Center, VStack } from '@chakra-ui/react';

import { Form, FormikProps } from 'formik';
import { FormEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { SubitemFieldArray } from '../form-controls/SubitemFieldArray';
import { ValidatedFormikControl } from '../form-controls/ValidatedFormikControl';
import { ValidatedFormikNumberControl } from '../form-controls/ValidatedFormikNumberControl';

type GroupFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function GroupForm(props: GroupFormProps) {
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
        value={formikProps.values.name}
        error={formikProps.errors.name}
        isRequired
        name="name"
        placeholder={t('name')}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={firstInputFieldRef}
      />

      <ValidatedFormikNumberControl
        isRequired
        value={formikProps.values.count}
        error={formikProps.errors.count}
        name="count"
        placeholder={t('servings')}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />

      <SubitemFieldArray
        formikProps={formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group]}
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
