export default p =>
  `<div>
  ${Object.entries(p)
    .filter(e => !!e[1])
    .sort()
    .map(
      entry =>
        `<div style="display:flex;justify-content:space-between;">
      <div>${entry[0]}:</div><div>${entry[1]}</div>
    </div>`,
    )
    .join('')}
</div>`
