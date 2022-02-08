import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Database, QueryParameters } from "../data/database";
import {
  Ingredient,
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";

const IngredientsPage = () => {
  const [data, setData] = useState<Array<IngredientInterface>>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    offset: 0,
    limit: 10,
  });

  const queryData = async () => {
    setLoading(true);
    console.log(
      `query data limit ${queryParams.limit} offset ${queryParams.offset}`
    );
    setData((await Database.shared().arrayOfIngredients(queryParams)) ?? []);
    setTotalRows(await Database.shared().countOfIngredients());
    setLoading(false);
  };

  useEffect(() => {
    queryData();
  }, []);

  return (
    <DataTable
      fixedHeader
      customStyles={{
        headRow: {
          style: {
            fontSize: "16px",
          },
        },
        rows: {
          style: {
            fontSize: "16px",
          },
        },
        pagination: {
          style: {
            fontSize: "16px",
          },
        },
      }}
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
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={async (currentRowsPerPage: number) => {
        console.log(`onChangeRowsPerPage ${currentRowsPerPage}`);
        setQueryParams({
          limit: currentRowsPerPage,
          offset: queryParams.offset,
        });
        queryData();
      }}
      onChangePage={(page: number, totalRows: number) => {
        console.log(`change page ${page - 1}`);
        setQueryParams({ limit: queryParams.limit, offset: page - 1 });
        queryData();
      }}
    />
  );
};

export default IngredientsPage;
