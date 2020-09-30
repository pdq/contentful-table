import TableController from './table-controller'
import { clamp } from './utils'

export const minColumns = 2
export const minRows = 2
const maxColumns = 10
const maxRows = 30

const columnsInputElem = document.getElementById(
  'columns-count'
) as HTMLInputElement
const rowsInputElem = document.getElementById('rows-count') as HTMLInputElement
const useColumnHeaderInputElem = document.getElementById(
  'use-column-header'
) as HTMLInputElement
const useRowHeaderInputElem = document.getElementById(
  'use-row-header'
) as HTMLInputElement
const addColumnButtonElem = document.getElementById(
  'add-column'
) as HTMLButtonElement
const removeColumnButtonElem = document.getElementById(
  'remove-column'
) as HTMLButtonElement
const addRowButtonElem = document.getElementById('add-row') as HTMLButtonElement
const removeRowButtonElem = document.getElementById(
  'remove-row'
) as HTMLButtonElement

columnsInputElem.min = minColumns.toString()
columnsInputElem.max = maxColumns.toString()
rowsInputElem.min = minRows.toString()
rowsInputElem.max = maxRows.toString()

/**
 * Create all the event handles on the table element's columns/rows and
 * auxiliary settings buttons/inputs
 *
 * @param tableElem HTML table one which to add/remove columns/rows
 */
const createHandlers = (table: TableController) => {
  /**
   * Set initial values from state
   */
  columnsInputElem.value = table.columns.toString()
  rowsInputElem.value = table.rows.toString()
  useColumnHeaderInputElem.checked = table.useColumnHeader
  useRowHeaderInputElem.checked = table.useRowHeader

  /**
   * Handle column header setting toggle
   */
  useColumnHeaderInputElem.onchange = function (ev) {
    const checked = (ev.currentTarget as HTMLInputElement).checked
    if (checked !== undefined) {
      table.setUseColumnHeader(checked)
    }
  }

  /**
   * Handle row header setting toggle
   */
  useRowHeaderInputElem.onchange = function (ev) {
    const checked = (ev.currentTarget as HTMLInputElement).checked
    if (checked !== undefined) {
      table.setUseRowHeader(checked)
    }
  }

  /**
   * Handles columns field input alter to change table column sizing
   */
  columnsInputElem.onchange = async function (ev) {
    const oldValue = table.columns
    const newValue = clamp(
      parseInt((ev.currentTarget as HTMLInputElement).value, 10),
      minColumns,
      maxColumns
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (let i = 0; i < diff; i++) {
        table.addColumn()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (let i = 0; i < diff; i++) {
        commitNewValue = await table.removeColumn()
      }
    }
    if (commitNewValue) {
      columnsInputElem.value = newValue.toString()
    } else {
      columnsInputElem.value = oldValue.toString()
    }
  }

  /**
   * Handles rows field input change to alter table row sizing
   */
  rowsInputElem.onchange = async function (ev) {
    const oldValue = table.rows
    const newValue = clamp(
      parseInt((ev.target as HTMLInputElement).value, 10),
      minRows,
      maxRows
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (let i = 0; i < diff; i++) {
        table.addRow()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (let i = 0; i < diff; i++) {
        commitNewValue = await table.removeRow()
      }
    }
    if (commitNewValue) {
      rowsInputElem.value = newValue.toString()
    } else {
      rowsInputElem.value = oldValue.toString()
    }
  }

  /**
   * Handles add column button clicks to add a new column and
   * increase columns input count by one
   */
  addColumnButtonElem.onclick = function (_ev) {
    const oldValue = table.columns
    const newValue = clamp(oldValue + 1, minColumns, maxColumns)
    table.addColumn()
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove column button clicks to remove the last column
   * and decrease columns input count by one
   */
  removeColumnButtonElem.onclick = async function (_ev) {
    const oldValue = table.columns
    const newValue = clamp(oldValue - 1, minColumns, maxColumns)
    const deleteConfirmed = await table.removeColumn()
    if (!deleteConfirmed) {
      return
    }
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles add row button clicks to add a new row and
   * increase the row input count by one
   */
  addRowButtonElem.onclick = function (_ev) {
    const oldValue = table.rows
    const newValue = clamp(oldValue + 1, minRows, maxRows)
    table.addRow()
    rowsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove row button clicks to remove a new row
   * and decrease the row input count by one
   */
  removeRowButtonElem.onclick = async function (_ev) {
    const oldValue = table.rows
    const newValue = clamp(oldValue - 1, minRows, maxRows)
    const deleteConfirmed = await table.removeRow()
    if (!deleteConfirmed) {
      return
    }
    rowsInputElem.value = newValue.toString()
  }
}

export default createHandlers
