// @flow
export default ({ activeNodes: n }: { activeNodes: Object }) => ({
  projekt: n.projekt ? [n.projekt] : [],
  isProjekt: !!n.projekt,
  ap: n.ap ? [n.ap] : [],
  isAp: !!n.ap,
  pop: n.ap ? [n.pop] : [],
  isPop: !!n.pop,
  tpop: n.ap ? [n.tpop] : [],
  isTpop: !!n.tpop,
  ziel: n.ap ? [n.ziel] : [],
  isZiel: !!n.ziel,
})
