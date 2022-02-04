import { Formik } from "formik";
import React, { FormEvent } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import * as Yup from "yup";
import { Ingredient } from "../data/models/ingredient";

export interface CreateIngredientFormProps {
  ingredient?: Ingredient;
  onSubmit: (ingredient: Ingredient) => void;
}

export function IngredientForm(props: CreateIngredientFormProps) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().label("Ingredient name").required(),
    priceCents: Yup.number().label("Price in cents").required(),
    servingCount: Yup.number().label("Number of servings").required(),
    servingMassGrams: Yup.number().label("Serving size (g or mL)").required(),
    servingEnergyKilocalorie: Yup.number()
      .label("Serving energy (kcal)")
      .required(),
    servingFatGrams: Yup.number().label("Serving fat (g)").required(),
    servingCarbohydrateGrams: Yup.number()
      .label("Serving carbohydrates (g)")
      .required(),
    servingProteinGrams: Yup.number().label("Serving protein (g)").required(),
  });

  return (
    <Formik<Partial<Ingredient>>
      initialValues={{ ...props.ingredient }}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values as Ingredient);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <Form
            onSubmit={(e) => {
              formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
            }}
          >
            <Form.Group className="mb-2">
              <FloatingLabel label={validationSchema.fields.name.spec.label}>
                <Form.Control
                  type="text"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="name"
                  placeholder={validationSchema.fields.name.spec.label}
                  value={formikProps.values.name as string | undefined}
                  isInvalid={formikProps.errors.name ? true : false}
                  isValid={
                    formikProps.touched.name &&
                    !formikProps.errors.name &&
                    formikProps.values.name !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={validationSchema.fields.priceCents.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="priceCents"
                  placeholder={validationSchema.fields.priceCents.spec.label}
                  value={formikProps.values.priceCents as number | undefined}
                  isInvalid={formikProps.errors.priceCents ? true : false}
                  isValid={
                    formikProps.touched.priceCents &&
                    !formikProps.errors.priceCents &&
                    formikProps.values.priceCents !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.priceCents}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={validationSchema.fields.servingCount.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="servingCount"
                  placeholder={validationSchema.fields.servingCount.spec.label}
                  value={formikProps.values.servingCount as number | undefined}
                  isInvalid={formikProps.errors.servingCount ? true : false}
                  isValid={
                    formikProps.touched.servingCount &&
                    !formikProps.errors.servingCount &&
                    formikProps.values.servingCount !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingCount}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={validationSchema.fields.servingMassGrams.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="servingMassGrams"
                  placeholder={
                    validationSchema.fields.servingMassGrams.spec.label
                  }
                  value={
                    formikProps.values.servingMassGrams as number | undefined
                  }
                  isInvalid={formikProps.errors.servingMassGrams ? true : false}
                  isValid={
                    formikProps.touched.servingMassGrams &&
                    !formikProps.errors.servingMassGrams &&
                    formikProps.values.servingMassGrams !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingMassGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={
                  validationSchema.fields.servingEnergyKilocalorie.spec.label
                }
              >
                <Form.Control
                  type="number"
                  step={1}
                  placeholder={
                    validationSchema.fields.servingEnergyKilocalorie.spec.label
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="servingEnergyKilocalorie"
                  value={
                    formikProps.values.servingEnergyKilocalorie as
                      | number
                      | undefined
                  }
                  isInvalid={
                    formikProps.errors.servingEnergyKilocalorie ? true : false
                  }
                  isValid={
                    formikProps.touched.servingEnergyKilocalorie &&
                    !formikProps.errors.servingEnergyKilocalorie &&
                    formikProps.values.servingEnergyKilocalorie !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingEnergyKilocalorie}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={validationSchema.fields.servingFatGrams.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  placeholder={
                    validationSchema.fields.servingFatGrams.spec.label
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="servingFatGrams"
                  value={
                    formikProps.values.servingFatGrams as number | undefined
                  }
                  isInvalid={formikProps.errors.servingFatGrams ? true : false}
                  isValid={
                    formikProps.touched.servingFatGrams &&
                    !formikProps.errors.servingFatGrams &&
                    formikProps.values.servingFatGrams !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingFatGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={
                  validationSchema.fields.servingCarbohydrateGrams.spec.label
                }
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  name="servingCarbohydrateGrams"
                  placeholder={
                    validationSchema.fields.servingCarbohydrateGrams.spec.label
                  }
                  value={
                    formikProps.values.servingCarbohydrateGrams as
                      | number
                      | undefined
                  }
                  isInvalid={
                    formikProps.errors.servingCarbohydrateGrams ? true : false
                  }
                  isValid={
                    formikProps.touched.servingCarbohydrateGrams &&
                    !formikProps.errors.servingCarbohydrateGrams &&
                    formikProps.values.servingCarbohydrateGrams !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingCarbohydrateGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <FloatingLabel
                label={validationSchema.fields.servingProteinGrams.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    validationSchema.fields.servingProteinGrams.spec.label
                  }
                  name="servingProteinGrams"
                  value={
                    formikProps.values.servingProteinGrams as number | undefined
                  }
                  isInvalid={
                    formikProps.errors.servingProteinGrams ? true : false
                  }
                  isValid={
                    formikProps.touched.servingProteinGrams &&
                    !formikProps.errors.servingProteinGrams &&
                    formikProps.values.servingProteinGrams !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingProteinGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="text-center d-grid">
              <Button type="submit" size="lg">
                Submit
              </Button>
            </Form.Group>
          </Form>
        );
      }}
    />
  );
}
