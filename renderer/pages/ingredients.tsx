import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Database } from "../data/database";
import {
  Ingredient,
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";

const IngredientsPage = () => {
  const [data, setData] = useState<Array<IngredientInterface>>([]);
  const [progressPending, setProgressPending] = useState(false);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);

  async function queryData(page: number) {
    setProgressPending(true);
    setData((await Database.shared().arrayOfIngredients(limit, page)) ?? []);
    setCount(await Database.shared().countOfIngredients());
    setProgressPending(false);
  }

  useEffect(() => {
    queryData(0);
  }, []);

  return (
    <DataTable
      fixedHeader
      columns={[
        {
          name: yupIngredientSchema.fields.name.spec.label,
          selector: (row: Ingredient) => row.name,
        },
        {
          name: yupIngredientSchema.fields.priceCents.spec.label,
          selector: (row: Ingredient) => row.priceCents,
        },
        {
          name: yupIngredientSchema.fields.servingCount.spec.label,
          selector: (row: Ingredient) => row.servingCount,
        },
        {
          name: yupIngredientSchema.fields.servingMassGrams.spec.label,
          selector: (row: Ingredient) => row.servingMassGrams,
        },
        {
          name: yupIngredientSchema.fields.servingEnergyKilocalorie.spec.label,
          selector: (row: Ingredient) => row.servingEnergyKilocalorie,
        },
        {
          name: yupIngredientSchema.fields.servingFatGrams.spec.label,
          selector: (row: Ingredient) => row.servingFatGrams,
        },
        {
          name: yupIngredientSchema.fields.servingCarbohydrateGrams.spec.label,
          selector: (row: Ingredient) => row.servingCarbohydrateGrams,
        },
        {
          name: yupIngredientSchema.fields.servingProteinGrams.spec.label,
          selector: (row: Ingredient) => row.servingProteinGrams,
        },
      ]}
      data={data}
      progressPending={progressPending}
      pagination
      paginationServer
      paginationTotalRows={count}
      onChangeRowsPerPage={async (newPerPage: number, page: number) => {
        setLimit(newPerPage);
        queryData(page);
      }}
      onChangePage={queryData}
    />
  );
};

export default IngredientsPage;
