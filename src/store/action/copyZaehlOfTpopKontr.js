// @flow
export default async ({
  store,
  tpopkontrIdFrom,
  tpopkontrIdTo,
}: {
  store: Object,
  tpopkontrIdFrom: number,
  tpopkontrIdTo: number,
}) => {
  // 1. fetch all tpopkontrzaehl
  await store.fetchTableByParentId('tpopkontrzaehl', tpopkontrIdFrom)
  // 2. add tpopkontrzaehl to new tpopkontr
  const tpopkontrzaehl = Array.from(store.table.tpopkontrzaehl.values()).filter(
    zaehl => zaehl.TPopKontrId === tpopkontrIdFrom
  )
  tpopkontrzaehl.forEach(zaehl =>
    store.copyTo(tpopkontrIdTo, 'tpopkontrzaehl', zaehl.id)
  )
}
