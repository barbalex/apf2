import { Parser } from '@json2csv/plainjs'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

const exportCsv = ({ fileName, data }) => {
  // maybe use "AsyncParser" if the synchronous "parse" blocks the ui to badly
  // see: https://mircozeiss.com/json2csv/#json2csv-async-parser-(streaming-api)
  const parse = (data, opts) => new Parser(opts).parse(data)
  const csvData = parse(data)
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileDownload(csvData, `${file}.csv`)
}

export default exportCsv
