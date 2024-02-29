import { IUserResponse } from "@/types/user.interface"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useActions } from "@/hooks/useActions"
import { variables } from "@/variables"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetByIdsQuery, useSearchUsersQuery } from "@/store/api/user.api"

interface UsersListProps {
  userIds: number[]
  setUserIds: Function
  boardId?: number
}

function UsersList({ userIds, setUserIds, boardId }: UsersListProps) {
  const inputSearch = useRef<HTMLInputElement>(null)
  const [searchStr, setSearchStr] = useState("")
  const [isShow, setIsShow] = useState(false)
  const { language } = useSelector((state: RootState) => state.options)
  const { isLoading, isError, data } = useGetByIdsQuery(userIds, { skip: userIds.length === 0 })
  const { showToast } = useActions()
  const {
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    data: dataSearch
  } = useSearchUsersQuery(searchStr, { skip: searchStr === "" })

  const dataSearchChecked = useMemo(
    () =>
      dataSearch && boardId && "length" in dataSearch
        ? dataSearch.filter(u => u.boardsPartipated?.find(b => b.id === boardId))
        : dataSearch,
    [dataSearch, boardId]
  )

  useEffect(() => {
    if (isError) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST_BY_IDS)
    }
  }, [isLoading])

  useEffect(() => {
    if (isErrorSearch) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST_SEARCH)
    }
  }, [isLoadingSearch])

  const deleteUser = (id: number) => {
    const index = userIds.findIndex(el => el === id)
    if (index !== undefined) setUserIds(userIds.slice(0, index).concat(userIds.slice(index + 1)))
  }

  const addUserClick = (user: IUserResponse) => {
    if (!userIds.find(id => id === user.id)) setUserIds([...userIds, user.id])
    setIsShow(false)
  }

  return (
    <>
      <div className="mb-1">
        <label>Users</label>
        <div className="input-group">
          <input
          data-testid="search-users-input"
            type="text"
            className="form-control w-50"
            placeholder={variables.LANGUAGES[language].ENTER_REQUEST}
            ref={inputSearch}
            onChange={e => setSearchStr(e.target.value)}
            onFocus={() => setIsShow(true)}
          />
          <button
            className="btn btn-secondary d-flex align-items-center add-board-behind-canvas"
            type="button"
            onClick={() => {
              inputSearch.current!.value = ""
              setSearchStr("")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>
      </div>

      {isShow && (
        <div className="position-relative">
          <ul
            onClick={() => setIsShow(false)}
            data-testid="searchList"
            id="searchList"
            className="list-group user-search-list position-absolute"
          >
            {dataSearchChecked &&
              searchStr !== "" &&
              "length" in dataSearchChecked &&
              dataSearchChecked.length > 0 &&
              dataSearchChecked.map(user => (
                <li
                  onClick={() => addUserClick(user)}
                  className="list-group-item p-2 cursor-pointer text-truncate"
                  key={user.email}
                  data-testid={"add-user-" + user.id}
                >
                  <div>{user.email}</div>
                  <div>{user.fullName}</div>
                </li>
              ))}
          </ul>
        </div>
      )}
      {userIds.length > 0 && (
        <ul data-testid="users-list" className="list-group users-list">
          {data &&
            "length" in data &&
            data.map(user => (
              <li className="list-group-item d-flex justify-content-between" key={user.id}>
                <div className="d-flex flex-column">
                  <div>{user.email}</div>
                  <div>{user.fullName}</div>
                </div>
                <button
                  data-testid={"remove-user-" + user.id}
                  className="btn btn-danger"
                  onClick={() => deleteUser(user.id)}
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
              </li>
            ))}
        </ul>
      )}
    </>
  )
}

export default UsersList
