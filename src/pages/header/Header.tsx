import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useActions } from '@/hooks/useActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import './Header.scss'
import { variables } from '@/variables';
import { Offcanvas as bootstrapOffcanvas } from 'bootstrap';

function Header() {
    const { setTheme, setLanguage } = useActions();
    const { token } = useSelector((state: RootState) => state.user);
    const { theme, language } = useSelector((state: RootState) => state.options);
    const navigate = useNavigate();

    const toggleCanvas = () => {
        if (window.innerWidth < variables.BURGER_BREAKPOINT) {
            const offcanvas = bootstrapOffcanvas.getOrCreateInstance('#offcanvasNav');
            offcanvas.toggle();
        }
    }

    return (
        <header className='bg-primary position-sticky top-0 z-2'>
            <nav className="navbar navbar-expand-sm navbar-dark header-wrapper m-auto ps-3 pe-3">
                {
                    token &&
                    <span className="navbar-brand cursor-pointer" onClick={() => navigate('/')}>
                        {variables.LANGUAGES[language].MY_BOARDS}
                    </span>
                }
                <div className='dropdown align-items-center d-flex cursor-pointer ms-auto'>
                    <div className="dropdown-toggle p-2" data-bs-toggle="dropdown" aria-expanded="false">
                        {
                            theme === 'dark' ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
                                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                                    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-sun-fill" viewBox="0 0 16 16">
                                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                                </svg>
                        }
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end position-absolute">
                        <li>
                            <span onClick={() => setTheme("dark")} className="dropdown-item">{variables.LANGUAGES[language].DARK}</span>
                        </li>
                        <li>
                            <span onClick={() => setTheme("light")} className="dropdown-item">{variables.LANGUAGES[language].LIGHT}</span>
                        </li>
                    </ul>
                </div>
                <div className="dropdown align-items-center d-flex cursor-pointer">
                    <div className="font-light dropdown-toggle p-2" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-translate" viewBox="0 0 16 16">
                            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z" />
                            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z" />
                        </svg>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><span onClick={() => setLanguage(1)} className="dropdown-item">English</span></li>
                        <li><span onClick={() => setLanguage(0)} className="dropdown-item">Русский</span></li>
                    </ul>
                </div>
                <button className="navbar-toggler ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNav" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {
                    token &&
                    <div className="offcanvas offcanvas-end" id="offcanvasNav">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                                {variables.LANGUAGES[language].MENU}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className='offcanvas-body'>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <span className="nav-link cursor-pointer"
                                        onClick={() => { navigate("/board/add"); toggleCanvas() }}>
                                        {variables.LANGUAGES[language].ADD_BOARD}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link cursor-pointer"
                                        onClick={() => { navigate("/cabinet"); toggleCanvas() }}>
                                        {variables.LANGUAGES[language].CABINET}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
            </nav>
        </header>
    );
}

export default Header;