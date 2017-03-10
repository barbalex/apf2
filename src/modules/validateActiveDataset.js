// @flow
import _forEach from 'lodash/forEach'
import Joi from 'joi-browser'

export default (table:string, row:Object, allFields:Array<Object>) => {
  const valid = {}
  if (!table || !row || !allFields || !allFields.length) {
    return valid
  }
  // beob_bereitgestellt is read only, so do not validate
  if (table === `beob_bereitgestellt`) return true
  const tableName = table
    .replace(`tpopfeldkontr`, `tpopkontr`)
    .replace(`tpopfreiwkontr`, `tpopkontr`)
  const fields = allFields.filter(f => f.table_schema === `apflora` && f.table_name === tableName)
  if (fields.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`validateActiveDataset: no fields found for table ${table}`)
    return valid
  }

  _forEach((row), (value, key) => {
    let validDataType = true
    const field = fields.find(f => f.column_name === key)
    if (field) {
      const dataType = field.data_type
      switch (dataType) {
        case `integer`: {
          validDataType = Joi.validate(
            value,
            Joi.number()
              .integer()
              .min(-2147483648)
              .max(+2147483647)
              .allow(``)
              .allow(null)
          )
          break
        }
        case `smallint`: {
          validDataType = Joi.validate(
            value,
            Joi.number()
              .integer()
              .min(-32768)
              .max(+32767)
              .allow(``)
              .allow(null)
          )
          break
        }
        case `double precision`: {
          validDataType = Joi.validate(
            value, Joi.number()
              .precision(15)
              .allow(``)
              .allow(null)
          )
          break
        }
        case `character varying`: {
          validDataType = Joi.validate(
            value,
            Joi.alternatives()
              .try(
                Joi.number(),
                Joi.string()
              )
              .allow(``)
              .allow(null)
          )
          // - if field type is varchar: check if value length complies to character_maximum_length
          const maxLen = field.character_maximum_length
          if (!validDataType.error && maxLen) {
            validDataType = Joi.validate(
              value,
              Joi.alternatives()
                .try(
                  Joi.string()
                    .max(maxLen),
                  Joi.number()
                )
                .allow(``)
                .allow(null)
            )
          }
          break
        }
        case `uuid`: {
          validDataType = Joi.validate(
            value,
            Joi.string()
              .guid()
              .allow(null)
          )
          break
        }
        case `date`: {
          validDataType = Joi.validate(
            value,
            Joi.string()
              .allow(null)
          )
          break
        }
        case `text`: {
          validDataType = Joi.validate(
            value,
            Joi.alternatives()
              .try(
                Joi.number(),
                Joi.string()
              )
              .allow(``)
              .allow(null)
          )
          break
        }
        default:
          // do nothing
      }
      if (validDataType && validDataType.error && validDataType.error.message) {
        valid[key] = validDataType.error.message
      } else if (valid[key] !== ``) {
        valid[key] = ``
      }
    }
  })
  return valid
}
