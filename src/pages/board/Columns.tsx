import { IBoard } from "@/types/board.interface"
import * as React from "react"
import { useRef, useState } from "react"
import Tasks from "./Tasks"
import Modal from "@/components/modal/Modal"
import { IColumn } from "@/types/column.interface"
import TaskAdd from "./TaskAdd"
import { ITask } from "@/types/task.interface"
import TaskChangeDelete from "./TaskChangeDelete"
import ColumnChangeDelete from "./ColumnChangeDelete"
import { useChangeColumnMutation } from "@/store/api/column.api"
import { useActions } from "@/hooks/useActions"
import { useChangeTaskMutation } from "@/store/api/task.api"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { variables } from "@/variables"

function Columns({ boardColumns }: { boardColumns: IColumn[] | undefined }) {
  const { showToast } = useActions()
  const { language } = useSelector((state: RootState) => state.options)
  const [currentColumn, setCurrentColumn] = useState<IColumn>()
  const [currentTask, setCurrentTask] = useState<ITask>()
  const [columns, setColumns] = useState<IColumn[]>()

  const [changeColumn, { isSuccess, isError, isLoading }] = useChangeColumnMutation()
  const [changeTask, { isSuccess: isSuccessTask, isError: isErrorTask, isLoading: isLoadingTask }] =
    useChangeTaskMutation()

  const [drugStartColumn, setDrugStartColumn] = useState<IColumn | undefined>()
  const [drugStartTask, setDrugStartTask] = useState<ITask | undefined>()

  React.useEffect(() => {
    if (isSuccessTask) setDrugStartTask(undefined)
    if (isErrorTask) {
      showToast(variables.LANGUAGES[language].ERROR_CHANGING_TASK_COL)
    }
  }, [isLoadingTask])

  React.useEffect(() => {
    if (isSuccess) setDrugStartColumn(undefined)
    if (isError) {
      showToast(variables.LANGUAGES[language].ERROR_CHANGING_COL_ORDER)
    }
  }, [isLoading])

  React.useEffect(() => {
    if (boardColumns) setColumns(boardColumns)
  }, [boardColumns])

  function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.className = "border rounded-2 p-2 cursor-grab"
  }

  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, c: IColumn) {
    setDrugStartColumn(c)
  }

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.currentTarget.className = "border rounded-2 p-2 cursor-grab bg-secondary"
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>, c: IColumn) {
    e.preventDefault()
    e.currentTarget.className = "border rounded-2 p-2 cursor-grab"
    if (drugStartColumn && c.order !== drugStartColumn.order) {
      let columnsTemp = columns?.slice()
      columnsTemp?.splice(drugStartColumn?.order - 1, 1)
      columnsTemp?.splice(c.order - 1, 0, drugStartColumn)
      setColumns(columnsTemp)
      changeColumn({
        id: drugStartColumn.id,
        order: c.order,
        name: drugStartColumn.name
      })
    } else if (drugStartTask && drugStartTask.columnId !== c.id && columns) {
      setColumns(
        columns.map(column => {
          let columnTemp = Object.assign({}, column)
          columnTemp.tasks = column.tasks?.slice()
          if (column.id === drugStartTask.columnId && column.tasks) {
            columnTemp.tasks = column.tasks.filter(t => t.id !== drugStartTask.id)
          } else if (column.id === c.id) {
            let taskTemp = Object.assign({}, drugStartTask)
            taskTemp.columnId = c.id
            taskTemp.moveDate = new Date()
            if (columnTemp.tasks?.length) columnTemp.tasks?.unshift(taskTemp)
            else columnTemp.tasks = [taskTemp]
          }
          return columnTemp
        })
      )
      setDrugStartTask(undefined)
      changeTask({
        id: drugStartTask.id,
        name: drugStartTask.name,
        userIds: drugStartTask.users.map(u => u.id),
        columnId: c.id
      })
    }
  }

  return (
    <div className="d-flex p-3 border rounded-2 board-columns flex-fill min-w-0 overflow-x-auto">
      <div className="d-flex gap-2 flex-fill">
        {columns &&
          columns?.map(c => (
            <div
              className="border rounded-2 p-2 cursor-grab"
              draggable={true}
              key={c.id}
              onDragLeave={dragLeaveHandler}
              onDragStart={e => dragStartHandler(e, c)}
              onDragOver={dragOverHandler}
              onDrop={e => dropHandler(e, c)}
            >
              <h5 className="m-0 mb-2 text-truncate">{c.name}</h5>
              <div className="d-flex gap-2">
                <button
                  onClick={() => setCurrentColumn(c)}
                  className="btn btn-primary flex-fill"
                  data-bs-toggle="modal"
                  data-bs-target="#changeColumn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fillRule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentColumn(c)}
                  className="btn btn-danger flex-fill"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteColumn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                  </svg>
                </button>
              </div>
              <hr className="mt-2 mb-2" />
              <Tasks
                column={c}
                setCurrentColumn={setCurrentColumn}
                setCurrentTask={setCurrentTask}
                setDrugStartTask={setDrugStartTask}
              />
            </div>
          ))}
        <button
          className="btn btn-primary border rounded-2"
          data-bs-toggle="modal"
          data-bs-target="#addColumn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-plus-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </button>
      </div>
      <ColumnChangeDelete currentColumn={currentColumn} />
      <TaskAdd column={currentColumn} />
      <TaskChangeDelete task={currentTask} />
    </div>
  )
}

export default Columns
