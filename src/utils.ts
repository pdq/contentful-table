/**
 * @documentation https://github.com/contentful/ui-extensions-sdk/blob/master/typings.d.ts
 */
import { FieldAPI } from 'contentful-ui-extensions-sdk'

/**
 * Optional table data that may seed the table with populated data -
 * such as when an existing table is accessed
 */
export type TableData = Array<Array<string>>

/**
 * Storage values for the extension's content field
 */
export interface ExtensionValues {
  useHeader: boolean
  tableData: TableData
}

/**
 * Field action prototype to edit the `ExtensionValues`
 * of this extension. Not all values on this object are typed here
 */
export type ExtensionField =
  | FieldAPI
  | {
      getValue: () => any
      setValue: (arg: any) => any
    }

/**
 * Contentful's `window.contentfulExtension` callback arg
 * Not all values on this object are typed here 😞
 */
export interface Extension {
  field: ExtensionField
}

/**
 * Seed the tableData with initial data, minimum rows/columns
 * should at least be passed in
 */
export const getInitialTableData = ({
  rows,
  columns,
}: {
  rows: number
  columns: number
}): TableData => {
  const data = []
  for (let i = 1; i <= rows; i++) {
    const row = []
    for (let j = 1; j <= columns; j++) {
      row.push(undefined)
    }
    data.push(row)
  }
  return data
}

/**
 * Pretend prototype for `Extension.field`
 */
class MockExtensionField {
  storageKeyName = 'mockContentfulData'

  private serialize(data: any): string {
    return JSON.stringify(data)
  }

  private deserialize(data: any): any {
    return JSON.parse(data)
  }

  setValue(value: any) {
    localStorage.setItem(this.storageKeyName, this.serialize(value))
    this.onValueChanged()
  }

  getValue() {
    return this.deserialize(localStorage.getItem(this.storageKeyName))
  }

  onValueChanged() {
    return this.getValue()
  }
}

export const createMockExtension = (): Extension => {
  return {
    field: new MockExtensionField(),
  }
}
