import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk'

import TableController from './table-controller'
import createHandlers, { minColumns, minRows } from './event-handlers'
import {
  useContentfulApi,
  createMockExtension,
  getInitialTableData,
  Extension,
} from './utils'

const contentElem = document.getElementById('table-extension-content')
const tableElem = contentElem.querySelector('table')

/**
 * Handles Contentful UI extension creation with initial values (if any)
 * and create the table contents dynamically based on our defaults passed
 * to `getInitialData`
 *
 * @param extension From Contentful API in order to handle data
 */
const handleInitialization = (extension?: Extension) => {
  let value = extension.field.getValue()
  /**
   * reset array if data corrupt -
   * This could only occur when changes to state structure
   * are made in a development environment.
   *
   * Resets state by resetting value definition
   */
  if (
    value &&
    value.tableData &&
    !Array.isArray(value.tableData) &&
    !Array.isArray(value.tableData[0])
  ) {
    value = undefined
  }

  if (!value) {
    /**
     * Default table values
     */
    value = {
      useColumnHeader: true,
      useRowHeader: false,
      tableData: getInitialTableData({
        columns: minColumns,
        rows: minRows,
      }),
    }
  }

  const tableController = new TableController({
    table: tableElem,
    state: value,
    db: extension.field,
    dialogs: extension.dialogs,
  })

  createHandlers(tableController)

  /**
   * Automatically size the iframe as the content grows
   * in order to avoid scrollbars within the extension
   */
  extension.window.updateHeight()
  extension.window.startAutoResizer()
}

/**
 * Conditionally set up environment for demo/dev and Contentful extension
 */
if (useContentfulApi()) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore we need to verify whether the types provided with the contentful SDK are correct or not
    initContentfulExtension(handleInitialization)
  } catch (err) {
    console.error(err) // eslint-disable-line no-console
    contentElem.innerHTML = `
      <div>
        <h1>
          Error
        </h1>
        <p>
          We encountered an error with the Table Contentful UI Extension.
        </p>
      </div>
    `
  }
} else {
  const mockExtension = createMockExtension()
  handleInitialization(mockExtension)
}
