import { Button, Center, VStack } from '@chakra-ui/react';
import { Form, FormikProps } from 'formik';
import { FormEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { itemMultiplyNutrition } from '../../data/interfaces/ItemHelpers';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { PriceNutritionGrid } from '../PriceNutritionGrid';
import { ValidatedFormikControl } from '../form-controls/ValidatedFormikControl';
import { ValidatedFormikNumberControl } from '../form-controls/ValidatedFormikNumberControl';
import { LocalStorageKeysEnum } from '../../constants';
import ItemFormControls from '../form-controls/ItemFormControls';

type ItemFormProps = {
  formikProps: FormikProps<ItemInterface>;
  onPaste: (text: string) => Promise<void>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function ItemForm(props: ItemFormProps) {
  const { t } = useTranslation();
  const { formikProps, onPaste } = props;
  const servingPriceCents =
    (formikProps.values.priceCents ?? 0) / (formikProps.values.count ?? 1);
  const servingNutritionInfo = itemMultiplyNutrition(
    { ...formikProps.values },
    formikProps.values.count ?? 0,
  );

  return (
    <Form
      onSubmit={(e) => {
        formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
      }}
    >
      <ItemFormControls {...props} />

      <Center>
        <VStack>
          <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
            {t('submit')}
          </Button>
          <PriceNutritionGrid
            priceCents={servingPriceCents}
            priceLabel={t('perServing')}
            nutritionInfo={servingNutritionInfo}
          />
        </VStack>
      </Center>
    </Form>
  );
}
