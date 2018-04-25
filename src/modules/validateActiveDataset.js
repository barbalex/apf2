// @flow
import _forEach from 'lodash/forEach'
import yup from 'yup'

export default (
  table: ?string,
  row: ?Object,
  allFields: Array<Object>
): Object => {
  const valid = {}
  if (!table || !row || !allFields || !allFields.length) {
    return valid
  }
  // beob is read only, so do not validate
  if (table === 'beob') return valid
  const tableName = table
    .replace('tpopfeldkontr', 'tpopkontr')
    .replace('tpopfreiwkontr', 'tpopkontr')
  const fields = allFields.filter(
    f => f.table_schema === 'apflora' && f.table_name === tableName
  )
  if (fields.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`validateActiveDataset: no fields found for table ${table}`)
    return valid
  }

  _forEach(row, (value, key) => {
    let validDataType = true
    const field = fields.find(f => f.column_name === key)
    if (field) {
      const dataType = field.data_type
      switch (dataType) {
        case 'integer': {
          validDataType = yup.validate(
            value,
            yup
              .number()
              .integer()
              .min(-2147483648)
              .max(+2147483647)
              .allow('')
              .allow(null)
          )
          break
        }

        case 'smallint': {
          validDataType = yup.validate(
            value,
            yup
              .number()
              .integer()
              .min(-32768)
              .max(+32767)
              .allow('')
              .allow(null)
          )
          break
        }

        case 'double precision': {
          validDataType = yup.validate(
            value,
            yup
              .number()
              .precision(15)
              .allow('')
              .allow(null)
          )
          break
        }

        case 'character varying': {
          validDataType = yup.validate(
            value,
            yup
              .alternatives()
              .try(yup.number(), yup.string())
              .allow('')
              .allow(null)
          )
          // - if field type is varchar: check if value length complies to character_maximum_length
          const maxLen = field.character_maximum_length
          if (!validDataType.error && maxLen) {
            validDataType = yup.validate(
              value,
              yup
                .alternatives()
                .try(yup.string().max(maxLen), yup.number())
                .allow('')
                .allow(null)
            )
          }
          break
        }

        case 'uuid': {
          validDataType = yup.validate(
            value,
            yup
              .string()
              .guid()
              .allow(null)
          )
          break
        }

        case 'date': {
          validDataType = yup.validate(value, yup.string().allow(null))
          break
        }

        case 'text': {
          validDataType = yup.validate(
            value,
            yup
              .alternatives()
              .try(yup.number(), yup.string())
              .allow('')
              .allow(null)
          )
          break
        }

        default:

        // do nothing
      }
      if (validDataType && validDataType.error && validDataType.error.message) {
        valid[key] = validDataType.error.message
      } else if (valid[key] !== '') {
        valid[key] = ''
      }
    }
  })
  return valid
}
