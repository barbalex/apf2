// @flow
export default async ({
  store,
  popIdFrom,
  popIdTo,
}: {
  store: Object,
  popIdFrom: number,
  popIdTo: number,
}) => {
  console.log('copyTpopsOfPop: popIdFrom:', popIdFrom)
  console.log('copyTpopsOfPop: popIdTo:', popIdTo)
  // 1. fetch all tpops
  store.fetchDatasetById({
    schemaName: 'apflora',
    tableName: 'pop',
    id: popIdFrom,
  })
  // 2. add copies to new pop

  // 3. reset withNextLevel???
  //store.copying.withNextLevel =
}
