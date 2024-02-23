import React, { useEffect } from "react"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import { store } from "./store/store"
import Toast from "./components/toast/Toast"
import { useSetTheme } from "./hooks/useSetTheme"
import AuthWrapper from "./pages/authorization/AuthWrapper"
import Login from "./pages/authorization/Login"
import Register from "./pages/authorization/Register"
import Custom404 from "./pages/notFound/NotFound"
import ReactDOM from "react-dom/client"
import Header from "./pages/header/Header"
import Wrapper from "./components/wrapper/Wrapper"
import MyBoards from "./pages/myBoards/MyBoards"
import AddBoard from "./pages/addBoard/AddBoard"
import Cabinet from "./pages/cabinet/Cabinet"
import Board from "./pages/board/Board"
import "./index.scss"

function App() {
  const setTheme = useSetTheme()

  useEffect(() => {
    setTheme()
  }, [])

  return (
    <Provider store={store}>
      <ErrorBoundary fallback={<h1 className="p-4">ERROR: Something went wrong</h1>}>
        <BrowserRouter>
          <Header />
          <Wrapper>
            <Routes>
              <Route
                path="/login"
                element={
                  <AuthWrapper>
                    <Login />
                  </AuthWrapper>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthWrapper>
                    <Register />
                  </AuthWrapper>
                }
              />
              <Route path="/" element={<MyBoards />} />
              <Route path="/board/add" element={<AddBoard />} />
              <Route path="/board/:id" element={<Board />} />
              <Route path="/cabinet" element={<Cabinet />} />
              <Route path="*" element={<Custom404 />} />
            </Routes>
          </Wrapper>
          <Toast />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)
