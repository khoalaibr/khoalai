// src/components/Header/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePage } from '../../../store/uiSlice';
import './Header.css';
import logo from '../../../assets/images/logo.png';

function Header() {

  const dispatch = useDispatch();
  const headerOptions = useSelector((state) => state.ui.headerOptions);
  const activePage = useSelector((state) => state.ui.activePage);

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="BPS" />
      </div>
      <nav className="header__nav">
        <ul className="nav-menu">
          {headerOptions.map((option) => {
            const path = `${activePage.split('/')[1]}/${option.toLowerCase()}`;
            return (
              <li key={option} className="nav-menu__item">
                <NavLink
                  to={`/${path}`}
                  className={({ isActive }) => `nav-menu__link ${isActive ? 'nav-menu__link--activa' : ''}`}
                  onClick={() => dispatch(setActivePage(`/${path}`))}
                >
                  {option}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="header__user-register">
        <div className="user-section">
          <i className="fa fa-user user-icon" />
          <span className="user-logout">Salir</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
