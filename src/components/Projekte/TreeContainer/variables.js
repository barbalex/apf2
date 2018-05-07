// @flow
export default ({ activeNodes: n }: { activeNodes: Object }) => ({
  projekt: n.projekt ? [n.projekt] : [],
  isProjekt: !!n.projekt,
  ap: n.ap ? [n.ap] : [],
  isAp: !!n.ap,
  pop: n.pop ? [n.pop] : [],
  isPop: !!n.pop,
  tpop: n.tpop ? [n.tpop] : [],
  isTpop: !!n.tpop,
  ziel: n.ziel ? [n.ziel] : [],
  isZiel: !!n.ziel,
  tpopkontr: !!n.tpopfeldkontr
    ? [n.tpopfeldkontr]
    : !!n.tpopfreiwkontr
      ? [n.tpopfreiwkontr]
      : [],
  isTpopkontr: !!n.tpopfeldkontr || !!n.tpopfreiwkontr,
})
