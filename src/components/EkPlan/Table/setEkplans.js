export default ({ tpopId, ekfrequenzCode, ekfrequenzStartjahr, client }) => {
  console.log('TODO: set ekplan', {
    tpopId,
    ekfrequenzCode,
    ekfrequenzStartjahr,
    client,
  })
  // 1. delete ekplans beginning with effrequenzStartjahr
  // 2. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  // 3. add kontrolljahre to ekplan
  // 4. tell user how it went
}
