import TableController from './tableController'
import { clamp } from './utils'

export const minColumns = 2
export const minRows = 2
const maxColumns = 10
const maxRows = 30

const columnsInputElem = document.getElementById(
  'columns-count'
) as HTMLInputElement
const rowsInputElem = document.getElementById('rows-count') as HTMLInputElement
const useHeaderInputElem = document.getElementById(
  'use-header'
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
const createHandlers = (controller: TableController) => {
  /**
   * Set initial values from state
   */
  columnsInputElem.value = controller.columns.toString()
  rowsInputElem.value = controller.rows.toString()
  useHeaderInputElem.checked = controller.useHeader

  /**
   * Handle header setting toggle
   */
  useHeaderInputElem.onchange = function(ev) {
    const checked = (<HTMLInputElement>ev.currentTarget).checked
    if (checked !== undefined) controller.setUseHeader(checked)
  }

  /**
   * Handles columns field input alter to change table column sizing
   */
  columnsInputElem.onchange = async function(ev) {
    const oldValue = controller.columns
    const newValue = clamp(
      parseInt((<HTMLInputElement>ev.currentTarget).value, 10),
      minColumns,
      maxColumns
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (var i = 0; i < diff; i++) {
        controller.addColumn()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (var i = 0; i < diff; i++) {
        commitNewValue = await controller.removeColumn()
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
  rowsInputElem.onchange = async function(ev) {
    const oldValue = controller.rows
    const newValue = clamp(
      parseInt((<HTMLInputElement>ev.target).value, 10),
      minRows,
      maxRows
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (var i = 0; i < diff; i++) {
        controller.addRow()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (var i = 0; i < diff; i++) {
        commitNewValue = await controller.removeRow()
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
  addColumnButtonElem.onclick = function(_ev) {
    const oldValue = controller.columns
    const newValue = clamp(oldValue + 1, minColumns, maxColumns)
    controller.addColumn()
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove column button clicks to remove the last column
   * and decrease columns input count by one
   */
  removeColumnButtonElem.onclick = async function(_ev) {
    const oldValue = controller.columns
    const newValue = clamp(oldValue - 1, minColumns, maxColumns)
    const deleteConfirmed = await controller.removeColumn()
    if (!deleteConfirmed) return
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles add row button clicks to add a new row and
   * increase the row input count by one
   */
  addRowButtonElem.onclick = function(_ev) {
    const oldValue = controller.rows
    const newValue = clamp(oldValue + 1, minRows, maxRows)
    controller.addRow()
    rowsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove row button clicks to remove a new row
   * and decrease the row input count by one
   */
  removeRowButtonElem.onclick = async function(_ev) {
    const oldValue = controller.rows
    const newValue = clamp(oldValue - 1, minRows, maxRows)
    const deleteConfirmed = await controller.removeRow()
    if (!deleteConfirmed) return
    rowsInputElem.value = newValue.toString()
  }
}

export default createHandlers
