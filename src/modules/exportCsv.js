import { parse } from 'json2csv'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

export default ({ fileName, data }) => {
  // maybe use "AsyncParser" if the synchronous "parse" blocks the ui to badly
  // see: https://mircozeiss.com/json2csv/#json2csv-async-parser-(streaming-api)
  const csvData = parse(data)
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileDownload(csvData, `${file}.csv`)
}
