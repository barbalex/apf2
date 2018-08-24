// see: https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844

export default val => !isNaN(parseFloat(val)) && isFinite(val)
