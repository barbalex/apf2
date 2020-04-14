// alternative: renderToString
// see: https://gis.stackexchange.com/a/356513/13491
export default (p) =>
  `<div>
  ${Object.entries(p)
    .filter((e) => !!e[1])
    .sort()
    .map(
      ([key, value]) =>
        `<div style="display:flex;justify-content:space-between;">
      <div>${key}:</div><div>&nbsp;${value}</div>
    </div>`,
    )
    .join('')}
</div>`
