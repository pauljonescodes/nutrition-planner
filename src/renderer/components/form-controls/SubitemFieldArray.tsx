import { FieldArray, FormikProps } from 'formik';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { SubitemField } from './SubitemField';

interface SubitemFieldArrayProps {
  formikProps: FormikProps<ItemInterface>;
  itemTypesIn: Array<ItemTypeEnum>;
  name: string;
  label?: string;
}

export function SubitemFieldArray(props: SubitemFieldArrayProps) {
  const { name } = props;
  return (
    <FieldArray name={name}>
      {(fieldArrayHelpers) => (
        <SubitemField {...props} fieldArrayHelpers={fieldArrayHelpers} />
      )}
    </FieldArray>
  );
}
