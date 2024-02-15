import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './store/store';
import Toast from './pages/toast/Toast';
import { useSetTheme } from './hooks/useSetTheme';
import AuthWrapper from './pages/authorization/AuthWrapper';
import Login from './pages/authorization/Login';
import Register from './pages/authorization/Register';
import Custom404 from './pages/notFound/NotFound';
import ReactDOM from 'react-dom/client';
import Header from './pages/header/Header';
import "./index.scss";
import Wrapper from './pages/wrapper/Wrapper';

function App() {

    const setTheme = useSetTheme();

    useEffect(() => {
        setTheme();
    }, [])

    return (

        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <Wrapper>
                    <Routes>
                        <Route path='/login'
                            element={
                                <AuthWrapper>
                                    <Login />
                                </AuthWrapper>
                            } />
                        <Route path='/register'
                            element={
                                <AuthWrapper>
                                    <Register />
                                </AuthWrapper>
                            } />
                        <Route path='/' element={<h1>LETS GO</h1>} />
                        <Route path='*' element={<Custom404 />} />
                    </Routes>
                </Wrapper>
                <Toast />
            </BrowserRouter>
        </Provider>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />)
