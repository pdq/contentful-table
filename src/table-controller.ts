import { Intent, ExtensionValues, ExtensionField, DialogsAPI } from './utils'
import { minColumns, minRows } from './event-handlers'

export default class TableController {
  /**
   * Table element on which to add/remove rows
   */
  table: HTMLTableElement
  /**
   * Values from existing tables and to append new values to
   */
  state: ExtensionValues
  /**
   * Save state to external source (Contentful extension or otherwise localStorage for demo)
   */
  db: ExtensionField
  /**
   * Can be utilized to unsubscribe to value changes
   */
  detachValueChangeHandler: (values: ExtensionValues) => void
  /**
   * API provided by Contentful to allow extension to respond to user feedback
   */
  dialogs: DialogsAPI

  /**
   * Initialize the table and its data
   */
  constructor({ table, state, db, dialogs }) {
    this.table = table
    this.state = state
    this.db = db
    this.dialogs = dialogs

    for (let i = 0; i < this.state.tableData.length; i++) {
      this.addRow()
    }

    this.handleColumnHeaderStyle()
    this.handleRowHeaderStyle()

    /**
     * @usage see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#field
     * Section: "Receiving notifications for external field value changes"
     * `detachValueChangeHandler` can be used to unsubscribe from onChange events
     */
    this.detachValueChangeHandler = this.db.onValueChanged(
      this.valueChangeHandler
    )
  }

  /**
   * Save the current state
   */
  save = () => {
    this.db.setValue(this.state)
  }

  /**
   * Getter for current state
   */
  get currentState() {
    return this.state
  }

  /**
   * Column getter
   */
  get columns() {
    return this.state.tableData[0].length
  }

  /**
   * Row getter
   */
  get rows() {
    return this.state.tableData.length
  }

  /**
   * Callback to handle external changes to values (parallel editing)
   * or when `ExtensionField.setValue` is called
   */
  private valueChangeHandler = (values: ExtensionValues) => {
    this.state = Object.assign({}, this.state, values)
  }

  /**
   * Change `useHeader` state
   */
  setUseColumnHeader = (useColumnHeader: boolean) => {
    this.state.useColumnHeader = useColumnHeader
    this.save()
    this.handleColumnHeaderStyle()
  }

  /**
   * Style table header for user according to header setting
   */
  handleColumnHeaderStyle = () => {
    const firstRowCells = Array.from(this.table.rows[0].cells)
    if (this.state.useRowHeader) {
      firstRowCells.shift()
    }

    if (this.state.useColumnHeader) {
      firstRowCells.forEach((cellElem) => {
        this.changeTag(cellElem, 'th')
      })
    } else {
      firstRowCells.forEach((cellElem) => {
        this.changeTag(cellElem, 'td')
      })
    }
  }

  setUseRowHeader = (useRowHeader: boolean) => {
    this.state.useRowHeader = useRowHeader
    this.save()
    this.handleRowHeaderStyle()
  }

  /**
   * Style row header according to header setting
   */
  handleRowHeaderStyle = () => {
    const rows = Array.from(this.table.rows)
    if (this.state.useRowHeader) {
      rows.forEach((rowElem) => {
        const firstCell = rowElem.cells[0]
        this.changeTag(firstCell, 'th')
      })
    } else {
      rows.forEach((rowElem, index) => {
        if (this.state.useColumnHeader && index === 0) {
          return
        }
        const firstCell = rowElem.cells[0]
        this.changeTag(firstCell, 'td')
      })
    }
  }

  /**
   * @source https://stackoverflow.com/a/15086834/6817437
   */
  private changeTag = (el: HTMLElement, newTagName: string) => {
    const newEl = document.createElement(newTagName)
    while (el.firstChild) {
      newEl.appendChild(el.firstChild)
    }
    /**
     * Backwards loop in order to maintain the original order of
     * any attributes
     */
    for (let i = el.attributes.length - 1; i >= 0; --i) {
      newEl.attributes.setNamedItem(el.attributes[i].cloneNode() as Attr)
    }
    el.parentNode.replaceChild(newEl, el)
  }

  /**
   * State item getter
   */
  get useColumnHeader() {
    return this.state.useColumnHeader
  }

  /**
   * State item getter
   */
  get useRowHeader() {
    return this.state.useRowHeader
  }

  /**
   * Confirm whether to delete, using Contentful Dialog API
   * if it's available, or just `window.confirm`
   *
   * @returns a promise of whether to delete
   */
  confirmDelete = async (message: string): Promise<boolean> => {
    if (this.dialogs) {
      return this.dialogs.openConfirm({
        title: 'Really delete?',
        message,
        intent: Intent.NEGATIVE,
      })
    } else {
      return window.confirm(message)
    }
  }

  /**
   * The magic behind `textarea` continuing to fill
   * parent `td` height. As text progresses to CRLF or is deleted,
   * the natural height of the textarea is evaluated, and all
   * textareas in the row are forced to match the height of the
   * tallest textarea in that row.
   *
   * @source Forked from https://stackoverflow.com/a/24676492/6817437
   *
   * @usage Should be applied to `textarea` oninput and when
   * new table cells are initialized
   *
   * @param element HTML textarea to measure automatic growth with input
   */
  private autoGrow = (element: HTMLTextAreaElement) => {
    // Scrollheight should only be evaluated when the element's height is 'auto'
    element.style.height = 'auto'
    const newHeight = element.scrollHeight
    element.style.height = `${newHeight}px`

    // Make sure all cells in row are as tall as the tallest
    const cellRow = element.dataset.row
    const rowTextElems: NodeListOf<HTMLTextAreaElement> = document.querySelectorAll(
      `[data-row="${cellRow}"]`
    )
    let largestHeight = newHeight
    rowTextElems.forEach((rowEl) => {
      const rowElOriginalHeight = rowEl.style.height
      rowEl.style.height = 'auto'
      const rowElHeight = rowEl.scrollHeight
      if (rowElHeight > largestHeight) {
        largestHeight = rowElHeight
      }
      rowEl.style.height = rowElOriginalHeight
    })
    rowTextElems.forEach((rowEl) => {
      rowEl.style.height = `${largestHeight}px`
    })
  }

  /**
   * @usage Add cell with textarea to a table row, initialize textarea
   * with an autogrow oninput feature and save changes
   *
   * @param rowElem     HTML row element on which to append cell
   * @param dataRow     Row index (y-axis, zero-based)
   * @param dataColumn  Column index (x-axis, zero-based)
   */
  addCell = (
    rowElem: HTMLTableRowElement,
    rowIndex: number,
    columnIndex: number
  ) => {
    const cell = rowElem.insertCell()
    const textArea = document.createElement('textarea')
    textArea.oninput = () => {
      this.autoGrow(textArea)
      this.state.tableData[rowIndex][columnIndex] = textArea.value || undefined
      this.save()
    }
    textArea.dataset.row = rowIndex.toString()
    textArea.dataset.column = columnIndex.toString()
    const { tableData } = this.state
    const value =
      tableData && tableData[rowIndex] && tableData[rowIndex][columnIndex]
    textArea.value = value || ''
    cell.appendChild(textArea)
    // Invoke once on init to match other cells in the same row
    this.autoGrow(textArea)
  }

  /**
   * @usage Add a row to the bottom of the table element
   */
  addRow = () => {
    const lastRow = this.table.rows[this.table.rows.length - 1]
    let index: number
    /**
     * Last row is not defined on the first pass
     * when creating a row on an empty table
     * and no `lastRow` is defined
     */
    if (lastRow) {
      const textElem = lastRow.querySelector('textarea')
      index = parseInt(textElem.dataset.row, 10) + 1
    } else {
      index = 0
    }

    const row = this.table.insertRow()
    const columns = this.state.tableData[0].length
    for (let j = 0; j < columns; j++) {
      const columnIndex = j
      this.addCell(row, index, columnIndex)
    }

    const cellColumns = new Array(columns)
    if (!this.state.tableData[index]) {
      this.state.tableData.push(cellColumns)
      this.save()
    }
    this.handleRowHeaderStyle()
  }

  /**
   * @usage Remove the last row from the table
   *
   * @returns A promise of whether the row was deleted
   */
  removeRow = async (): Promise<boolean> => {
    if (this.table.rows.length <= minRows) {
      return
    }
    const deleteIndex = this.table.rows.length - 1
    let needsConfirmation = false,
      removeValues = ''
    const row = this.table.rows[deleteIndex].cells
    Array.from(row).forEach((cellElem) => {
      const textElem = cellElem.querySelector('textarea')
      if (!!textElem.value) {
        needsConfirmation = true
        removeValues += `\n\n${textElem.value}`
      }
    })
    const yesDelete = needsConfirmation
      ? await this.confirmDelete(
          `Are you sure you want to delete row ${
            deleteIndex + 1
          }?${removeValues}`
        )
      : true
    if (yesDelete) {
      this.table.deleteRow(deleteIndex)
      this.state.tableData.splice(deleteIndex, 1)
      this.save()
    }
    return yesDelete
  }

  /**
   * @usage Add a new column to the right in the table
   */
  addColumn = () => {
    const lastCell = this.table.rows[0].cells[
      this.table.rows[0].cells.length - 1
    ]
    const textElem = lastCell.querySelector('textarea')
    const columnPosition = parseInt(textElem.dataset.column, 10) + 1

    Array.from(this.table.rows).forEach((rowEl, index) => {
      const firstCell = rowEl.cells[0]
      const textElem = firstCell.querySelector('textarea')
      const rowPosition = parseInt(textElem.dataset.row, 10)
      this.addCell(rowEl, rowPosition, columnPosition)
      this.state.tableData[index].push(undefined)
      this.save()
    })
    this.handleColumnHeaderStyle()
  }

  /**
   * @usage Remove the table column with the highest index (or most-recently created)
   *
   * @returns A promise of whether the row was deleted
   */
  removeColumn = async (): Promise<boolean> => {
    if (this.table.rows[0].cells.length <= minColumns) {
      return
    }
    const lastCell = this.table.rows[0].cells[
      this.table.rows[0].cells.length - 1
    ]
    const textElem = lastCell.querySelector('textarea')
    const columnNumber = parseInt(textElem.dataset.column, 10) + 1

    let needsConfirmation = false,
      removeValues = ''
    Array.from(this.table.rows).forEach((rowElem) => {
      const lastCell = rowElem.cells[rowElem.cells.length - 1]
      const textElem = lastCell.querySelector('textarea')
      if (!!textElem.value) {
        needsConfirmation = true
        removeValues += `\n\n${textElem.value}`
      }
    })
    const yesDelete = needsConfirmation
      ? await this.confirmDelete(
          `Are you sure you want to delete column ${columnNumber}?${removeValues}`
        )
      : true
    if (yesDelete) {
      Array.from(this.table.rows).forEach((rowEl, index) => {
        const deleteIndex = rowEl.cells.length - 1
        rowEl.deleteCell(deleteIndex)
        this.state.tableData[index].splice(deleteIndex, 1)
        this.save()
      })
    }
    return yesDelete
  }
}
