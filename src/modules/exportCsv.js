// @flow
import { parse } from 'json2csv'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

export default ({
  fileName,
  data,
}: {
  fileName: string,
  data: Array<Object>,
}) => {
  const csvData = parse(data)
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileDownload(csvData, `${file}.csv`)
}
