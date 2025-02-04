// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebarSelected } from '../../../store/uiSlice';
import './Sidebar.css';

function Sidebar() {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const sidebarSelected = useSelector((state) => state.ui.sidebarSelected);

  // Items del sidebar (hardcodeados, sin archivo de config)
  const sidebarItems = [
    { label: 'Inicio', value: 'Home', icon: 'fa-home' },
    { label: 'Atención', value: 'Atencion', icon: 'fa-person' },
    { label: 'Informes', value: 'Informes', icon: 'fa-file' },
    { label: 'Oficios', value: 'Oficios', icon: 'fa-feather' },
  ];

  const handleToggleClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <ul className="sidebar__list">
        {sidebarItems.map((item) => (
          <li
          key={item.value}
          className={`sidebar__item ${sidebarSelected === item.value ? 'sidebar__item--activo' : ''}`}
          onClick={() => dispatch(setSidebarSelected(item.value))}
        >
          <i className={`sidebar__icon fa ${item.icon}`} />
          <span className="sidebar__text">{item.label}</span>
        </li>
        ))}

        {/* Botón de toggle para expandir/colapsar */}
        <li
          className="sidebar__item sidebar__toggle-btn"
          onClick={handleToggleClick}
        >
          <i className={`fa ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
