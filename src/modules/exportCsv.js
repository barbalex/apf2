// @flow
import json2csv from 'json2csv'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

export default ({
  fileName,
  jsonData,
}: {
  fileName: string,
  jsonData: Array<Object>,
}) => {
  const csvData = json2csv({ data: jsonData })
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileDownload(csvData, `${file}.csv`)
}
