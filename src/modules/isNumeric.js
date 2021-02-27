// see: https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844

const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val)

export default isNumeric
