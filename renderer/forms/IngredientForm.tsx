import { Formik } from "formik";
import React, { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { Ingredient } from "../data/models/ingredient";

export interface CreateIngredientFormProps {
  ingredient?: Ingredient;
  onSubmit: (ingredient: Ingredient) => void;
}

export function IngredientForm(props: CreateIngredientFormProps) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().label("Name").required(),
    priceCents: Yup.number().label("Price").required(),
    servingCount: Yup.number().label("Servings").required(),
    servingMassGrams: Yup.number().label("Mass").required(),
    servingEnergyKilocalorie: Yup.number().label("Energy").required(),
    servingFatGrams: Yup.number().label("Fat").required(),
    servingCarbohydrateGrams: Yup.number().label("Carbs").required(),
    servingProteinGrams: Yup.number().label("Protein").required(),
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
              <Form.Label>{validationSchema.fields.name.spec.label}</Form.Label>
              <Form.Control
                type="text"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder="Name of ingredient"
                name="name"
                value={formikProps.values.name as string | undefined}
                isInvalid={formikProps.errors.name ? true : false}
                isValid={
                  formikProps.touched.name &&
                  !formikProps.errors.name &&
                  formikProps.values.name !== undefined
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.priceCents.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder="Price in cents"
                name="priceCents"
                value={formikProps.values.priceCents as number | undefined}
                isInvalid={formikProps.errors.priceCents ? true : false}
                isValid={
                  formikProps.touched.priceCents &&
                  !formikProps.errors.priceCents &&
                  formikProps.values.priceCents !== undefined
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.priceCents}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.servingCount.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder="Number of servings per container"
                name="servingCount"
                value={formikProps.values.servingCount as number | undefined}
                isInvalid={formikProps.errors.servingCount ? true : false}
                isValid={
                  formikProps.touched.servingCount &&
                  !formikProps.errors.servingCount &&
                  formikProps.values.servingCount !== undefined
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingCount}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.servingMassGrams.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingMassGrams"
                placeholder="Serving mass in grams"
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
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingMassGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.servingEnergyKilocalorie.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                placeholder="Serving energy in kilocalories"
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
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingEnergyKilocalorie}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.servingFatGrams.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingFatGrams"
                placeholder="Serving fat in grams"
                value={formikProps.values.servingFatGrams as number | undefined}
                isInvalid={formikProps.errors.servingFatGrams ? true : false}
                isValid={
                  formikProps.touched.servingFatGrams &&
                  !formikProps.errors.servingFatGrams &&
                  formikProps.values.servingFatGrams !== undefined
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingFatGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {validationSchema.fields.servingCarbohydrateGrams.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingCarbohydrateGrams"
                placeholder="Serving carbohydrates in grams"
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
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingCarbohydrateGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                {validationSchema.fields.servingProteinGrams.spec.label}
              </Form.Label>
              <Form.Control
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder="Serving protein in grams"
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
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingProteinGrams}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="text-center d-grid">
              <Button type="submit">Submit</Button>
            </Form.Group>
          </Form>
        );
      }}
    />
  );
}
