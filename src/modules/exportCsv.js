// @flow
import { parse } from 'json2csv'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

export default ({
  fileName,
  jsonData,
}: {
  fileName: string,
  jsonData: Array<Object>,
}) => {
  const csvData = parse(jsonData)
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileDownload(csvData, `${file}.csv`)
}
