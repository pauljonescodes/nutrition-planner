import { Button, Center, VStack } from '@chakra-ui/react';
import { Form, FormikProps } from 'formik';
import { FormEvent, Fragment, RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { DeleteAlertDialog } from '../DeleteAlertDialog';
import { SubitemFieldArray } from '../form-controls/SubitemFieldArray';
import { ValidatedDatetimeControl } from '../form-controls/ValidatedDateTimeControl';

type LogFormProps = {
  formikProps: FormikProps<ItemInterface>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
  onDelete?: (item: ItemInterface | null) => void;
};

export default function LogForm(props: LogFormProps) {
  const { formikProps, onDelete } = props;
  const { t } = useTranslation();
  const [showDeleteState, setShowDeleteState] = useState<boolean>(false);
  return (
    <>
      <Form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
        }}
      >
        <ValidatedDatetimeControl
          isRequired
          value={
            formikProps.values.date
              ? new Date(formikProps.values!.date!)
              : undefined
          }
          error={formikProps.errors.date}
          name="date"
          placeholder={t('date')}
          formikProps={formikProps}
          spaceProps={{ pb: 2 }}
        />

        <SubitemFieldArray
          formikProps={formikProps}
          itemTypesIn={[
            ItemTypeEnum.item,
            ItemTypeEnum.group,
            ItemTypeEnum.plan,
          ]}
          name={"subitems"}
          label={t("items")}
        />

        <Center>
          <VStack width="full">
            <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
              {t('submit')}
            </Button>
            {onDelete && (
              <Button
                colorScheme="red"
                my={4}
                isLoading={formikProps.isSubmitting}
                onClick={() => setShowDeleteState(true)}
              >
                {t('delete')}
              </Button>
            )}
          </VStack>
        </Center>
      </Form>
      <DeleteAlertDialog
        isOpen={showDeleteState}
        onResult={async (result: boolean) => {
          setShowDeleteState(false);
          if (result && onDelete) {
            onDelete(formikProps.values);
          }
        }}
      />
    </>
  );
}
