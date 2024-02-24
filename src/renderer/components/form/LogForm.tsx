import {
  Button,
  Center,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { Form, FormikProps } from 'formik';
import { FormEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { DeleteAlertDialog } from '../DeleteAlertDialog';
import { SubitemFieldArray } from '../form-controls/SubitemFieldArray';
import { ValidatedDatetimeControl } from '../form-controls/ValidatedDateTimeControl';
import { LogSubitemFormControls } from '../form-controls/LogSubitemFormControls';

type LogFormProps = {
  formikProps: FormikProps<ItemInterface>;
  onDelete?: (item: ItemInterface | null) => void;
  onPaste: (text: string) => Promise<void>;
  onChangeType: (isLog: boolean) => void;
  isEditing: boolean;
};

export default function LogForm(props: LogFormProps) {
  const { formikProps, onDelete, onPaste, isEditing, onChangeType } = props;
  const { t } = useTranslation();
  const [showDeleteState, setShowDeleteState] = useState<boolean>(false);

  const subitemFieldArray = (
    <SubitemFieldArray
      formikProps={formikProps}
      itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group, ItemTypeEnum.plan]}
      name="subitems"
    />
  );

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

        {isEditing && subitemFieldArray}
        {!isEditing && (
          <Tabs
            onChange={(index) => {
              onChangeType(index === 0);
            }}
          >
            <TabList>
              <Tab key='subitems-tab'>{t('subitems')}</Tab>
              <Tab key='item'>{t('item')}</Tab>
            </TabList>

            <TabPanels>
              <TabPanel key='subitems-tabpanel'>{subitemFieldArray}</TabPanel>
              <TabPanel key='items-tabpanel'>
                <LogSubitemFormControls
                  formikProps={formikProps}
                  onPaste={onPaste}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}

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
