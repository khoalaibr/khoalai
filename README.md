npm create vite@latest base-frontend -- --template react
cd base-frontend
npm install

npm install react-router-dom

npm install @reduxjs/toolkit react-redux

npm install axios

npm install @fortawesome/fontawesome-svg-core 
            @fortawesome/free-solid-svg-icons 
            @fortawesome/react-fontawesome

Modificar index.html

Cambiar src/assets/images/logo.png

# vite.config.js para GitHub Pages

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  base: mode === 'production' ? '/base-frontend/' : '/',
  build: {
    outDir: 'docs', // Si estás usando 'docs' para GitHub Pages
  },
}))

# Estructura

my-react-app/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── .env
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.png
│   │   └── fonts/
│   │       └── ...
│   ├── components/
│   │   ├── Layout/
│   │   │  └── Footer/
│   │   │       └── Footer.jsx
│   │   │       └── Footer.css
│   │   │  └── Header/
│   │   │       └── Header.jsx
│   │   │       └── Header.css
│   │   │  └── Sidebar/
│   │   │       └── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   │  └── MainLayout/
│   │   │       └── MainLayout.jsx
│   │   │       └── MainLayout.css
│   │   │   ├── EjemploPage.jsx
│   │   └── ExampleComponent.jsx
│   ├── pages/
│   │   ├── Ejemplo/
│   │   │   ├── EjemploPage.jsx
│   │   │   └── Page.css        // Tiene el css basico p/ las pags 
│   │   └── ...
│   ├── routes/
│   │   └── AppRouter.jsx
│   ├── services/ (*** aun no desarrollado ***)
│   │   └── api.js                  // Configuración base de axios
│   ├── store/
│   │   └── index.js                // Configuración de Redux Store
│   │   └── uiSlice.js              // Slice de redux
│   ├── styles/
│   │   └── style.css              // Hoja de estilos global
│   ├── App.jsx
│   └── main.jsx
└── ...
























En fin he desarrollado una estructura base para mi desarrollo.
Lo que hace, resumidamente, es mostrar el sidebar, del sidebar selecciono una categoria y cada categoria muestra paginas distintas en el header. Seleccionando una determinada pagina, la visualizo en el centro. 
Te voy a pasar mi estructura, como quedó, para que la conozcas y opines si te parece bien. 

# Estructura

my-react-app/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── .env
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.png
│   │   └── fonts/
│   │       └── ...
│   ├── components/
│   │   ├── Layout/
│   │   │  └── Footer/
│   │   │       └── Footer.jsx
│   │   │       └── Footer.css
│   │   │  └── Header/
│   │   │       └── Header.jsx
│   │   │       └── Header.css
│   │   │  └── Sidebar/
│   │   │       └── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   │  └── MainLayout/
│   │   │       └── MainLayout.jsx
│   │   │       └── MainLayout.css
│   │   │   ├── EjemploPage.jsx
│   │   └── ExampleComponent.jsx
│   ├── pages/
│   │   ├── Ejemplo/
│   │   │   ├── EjemploPage.jsx
│   │   │   └── Page.css        // Tiene el css basico p/ las pags 
│   │   └── ...
│   ├── routes/
│   │   └── AppRouter.jsx
│   ├── services/ (*** aun no desarrollado ***)
│   │   └── api.js                  // Configuración base de axios
│   ├── store/
│   │   └── index.js                // Configuración de Redux Store
│   │   └── uiSlice.js              // Slice de redux
│   ├── styles/
│   │   └── style.css              // Hoja de estilos global
│   ├── App.jsx
│   └── main.jsx
└── ...

Mi idea es partir de esa base para mis desarrollos.
Faltaria implementar la parte del service donde se implementaria  api.js, ya que pienso manejarme con un backend que expondrá endpoints y lo trabajaré en axios. Te animas a ayudarme a finalizarlo. 
Me manejaré con las constantes (como ser la URL a la api, entre otras) en un archivo .env

Otra cosa que me interesa es que me ayudes con la pagina de login. 
Necesito crear una pagina de login basica (usuario y contrasenia), pero que además permita registrarse, caso no este registrado (pueden ser 2 paginas, si te parece mejor).
Pero partamos de la base de que ya tengo un backend que permite registro, login, etc. 
Te voy a pasar un ejemplo de prueba de backend donde te va a quedar mas claro las funcionalidades:
'''
Resumen de Pasos de Prueba
Inserta Roles en la tabla roles usando SQL:
sql
Copiar
Editar
INSERT INTO roles (name) VALUES ('User'), ('Admin'), ('Superadmin');
Registrar un usuario (por ejemplo, con rol=User por defecto):
http
Copiar
Editar
POST /auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
Login para obtener tu accessToken:
http
Copiar
Editar
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
La respuesta te dará accessToken.
Crear otro usuario usando /users (necesitas Authorization: Bearer <TOKEN> en headers). Por ejemplo, asignar rol=Admin:
http
Copiar
Editar
POST /users
Authorization: Bearer eyJhbGciOi...

{
  "username": "adminUser",
  "email": "admin@example.com",
  "password": "supersecret",
  "roleId": 2
}
Listar todos los usuarios:
http
Copiar
Editar
GET /users
Authorization: Bearer eyJhbGciOi...
Actualizar un usuario:
http
Copiar
Editar
PATCH /users/1
Authorization: Bearer eyJhbGciOi...

{
  "username": "johnTheSecond"
}
Borrado lógico:
http
Copiar
Editar
DELETE /users/1
Authorization: Bearer eyJhbGciOi...
El usuario con id=1 pasará a isActive=false.
'''

Por ultimo, lo que te pido, es que me ayudes a formular un buen PROMPT que me ayude a comenzar cada proyecto nuevo que inicie. 

Lo que quiero es. Por ejemplo: Voy a utilizar mi estructura y comenzar un proyecto nuevo que haga tal y cual cosa. 
Bueno. Quiero que el prompt le explique a una IA que es lo que pretendo hacer y de donde parto. Quiero que la IA sepa como esta formada mi estructura, lo que hace y así, cuando vaya a ayudarme con el codigo, tenga al tanto la estructura que debe seguir. Donde debe colocar los archivos que cree, etc. 
Eso tanto para crear un proyecto como para agregar una pagina al proyecto, por ejemplo. 




































































Quiero continuar un proyecto existente en React con Vite. 
Cuento con la siguiente arquitectura de archivos:

khoalai/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── .env
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.png
│   │   └── fonts/
│   │       └── ...
│   ├── components/
│   │   ├── Layout/
│   │   │  └── Footer/
│   │   │       └── Footer.jsx
│   │   │       └── Footer.css
│   │   │  └── Header/
│   │   │       └── Header.jsx
│   │   │       └── Header.css
│   │   │  └── Sidebar/
│   │   │       └── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   │  └── MainLayout/
│   │   │       └── MainLayout.jsx
│   │   │       └── MainLayout.css
│   │   └── ExampleComponent.jsx
│   ├── pages/
│   │   ├── Ejemplo/
│   │   │   ├── EjemploPage.jsx
│   │   │   └── Page.css
│   │   └── ...
│   ├── routes/
│   │   └── AppRouter.jsx
│   ├── services/
│   │   └── api.js
│   ├── store/
│   │   └── index.js
│   │   └── uiSlice.js
│   ├── styles/
│   │   └── style.css
│   ├── utils/       (aqui pueden ir funciones utiles)
│   ├── App.jsx
│   └── main.jsx
└── ...

Esta estructura hace lo siguiente:
- **Sidebar**: muestra categorías.
- **Header**: cambia según la categoría seleccionada.
- **Contenido central**: renderiza la página de acuerdo a la selección del header.
- **Footer**: layout global.
- Manejo de estado global con Redux (en `store/`).
- Configuración de Axios en `services/api.js`, usando variables de entorno (en `.env`) para la baseURL.
- Uso de React Router en `routes/AppRouter.jsx`.

### Lo que busco:
1. Quiero agregar una pagina al proyecto que sea similar a la que te voy a pasar como al final {PAGINA_A_COPIAR}.
Con la diferencia de que quiero que me integres el codigo a la estructura.
Si es posible usa redux, para los datos. Se me ocurre que podria haber un traderSlice o algo asi.
Ademas quiero que se vea integrada en una pagina de ejemplo (en la estructura se ve como EjemploPage.jsx, que te la voy a pasar tambien: {PAGINA_EJEMPLO}. Quiero que los resultados se vean a la derecha, dentro de '<section className="right-column">').
Por ultimo, como veras en la {PAGINA_A_COPIAR}, una de las cosas que hago es permitir la conversion a PDF, XLS Y CSV. Eso quiero que continue. Pero quiero que, manteniendo la estructure, trates de integrarla, en 'utils' o donde te parezca, en funciones que luego permitan realizar lo mismo en todas las paginas, sin tener que duplicar el codigo.
2. Necesito que la IA me dé ejemplos de código, siguiendo esta estructura y convenciones. Y no olvide de pasarme todas las instalaciones que debo hacer.
3. Quiero que, cuando se creen nuevos archivos, la IA me indique en qué carpeta deberían ubicarse.


### Contexto adicional:
- [Explicas si manejas roles, tokens, interceptores de Axios, etc.]
- [Indicas si prefieres CSS puro, Sass, Styled Components, etc.]

Con esta información, **requiero que me asistas con**:
- Generar componentes.
- Crear slices de Redux nuevos o editar los existentes.
- Configurar las rutas correspondientes.
- Proporcionar ejemplos de llamadas a la API usando `api.js`.

Te paso el contenido de .env
VITE_API_SERVICE=https://trader-khoalai-bc0010f22430.herokuapp.com

#{PAGINA_A_COPIAR}
'''
// src/pages/ConsolidatedActionsPage.jsx
import React, { useState } from 'react';
import mlApi from '../services/mlApi';

import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ConsolidatedActionsPage() {
  // Las mismas estrategias que antes
  const strategies = [
    "breakout_range", 
    "fibonacci_rsi", 
    "macd_crossover", 
    "rsi_v2", 
    "volume_breakout"
  ];

  const [consolidated, setConsolidated] = useState({});

  // Para el render en tabla
  // Lo convertiremos a un array de { symbol, strategy, action }
  const [flattenedData, setFlattenedData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConsolidateActions = async () => {
    setLoading(true);
    setError(null);
    setConsolidated({});
    setFlattenedData([]);

    try {
      // 1) Hacemos las llamadas en paralelo
      const promises = strategies.map(async (strat) => {
        const resp = await mlApi.get(`/backtestAll/${strat}`);
        // resp.data => { symbolKey: { symbol, date, action }, ... }
        let dataArr = Object.values(resp.data);

        // Filtrar solo Buy y Sell
        dataArr = dataArr.filter(item => 
          item.action === 'Buy' || item.action === 'Sell'
        );

        return { strategy: strat, data: dataArr };
      });

      const allResults = await Promise.all(promises);

      // 2) Construimos un diccionario: symbol => { [strategy]: action }
      // Ej: consolidated["G2DD34"]["breakout_range"] = "Buy"
      const dictionary = {};

      allResults.forEach((res) => {
        const strat = res.strategy;
        res.data.forEach((item) => {
          const sym = item.symbol;
          if (!dictionary[sym]) {
            dictionary[sym] = {};
          }
          dictionary[sym][strat] = item.action;
        });
      });

      // 3) Convertimos "dictionary" a un array “plano” para exportar CSV/Excel/PDF
      //    Por ejemplo, { symbol, strategy, action }
      const flattened = [];
      Object.keys(dictionary).forEach((sym) => {
        // dictionary[sym] => { breakout_range: "Buy", volume_breakout: "Sell", ... }
        const stratObj = dictionary[sym];
        Object.keys(stratObj).forEach((s) => {
          flattened.push({
            symbol: sym,
            strategy: s,
            action: stratObj[s],
          });
        });
      });

      // Ordenar por symbol (opcional) 
      flattened.sort((a, b) => {
        // p.e. alfabéticamente por symbol
        return a.symbol.localeCompare(b.symbol) || 
               a.strategy.localeCompare(b.strategy);
      });

      setConsolidated(dictionary);
      setFlattenedData(flattened);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al consolidar acciones');
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Exportar CSV/Excel/PDF
  // ======================
  const csvHeaders = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Strategy', key: 'strategy' },
    { label: 'Action', key: 'action' },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consolidated');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `consolidated_actions_${new Date().toISOString()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Symbol', 'Strategy', 'Action'];
    const tableRows = [];

    flattenedData.forEach((item) => {
      tableRows.push([
        item.symbol,
        item.strategy,
        item.action
      ]);
    });

    doc.text('Consolidated Actions Report', 14, 20);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`consolidated_actions_${new Date().toISOString()}.pdf`);
  };

  // ======================
  // Render
  // ======================
  return (
    <div>
      <h2>Acciones Consolidadas entre Estrategias</h2>
      <p>
        Se consultan las mismas estrategias: 
        {`[ ${strategies.join(', ')} ]`} 
        en <code>/backtestAll/&lt;strategy&gt;</code>, 
        filtra solo Buy/Sell, y unifica en una sola vista.
      </p>

      {/* Botón para consolidar */}
      <button
        className="btn btn-primary mb-3"
        onClick={handleConsolidateActions}
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Consolidar Acciones (Buy/Sell)'}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Botones de descarga */}
      {flattenedData.length > 0 && !loading && (
        <div className="mb-3 d-flex gap-2">
          <CSVLink
            headers={csvHeaders}
            data={flattenedData}
            filename={`consolidated_actions_${new Date().toISOString()}.csv`}
            className="btn btn-secondary"
          >
            CSV
          </CSVLink>

          <button onClick={exportToExcel} className="btn btn-success">
            Excel
          </button>

          <button onClick={exportToPDF} className="btn btn-danger">
            PDF
          </button>
        </div>
      )}

      {/* Vista final: un loop sobre consolidated => Symbol => (estrategia => action) */}
      {Object.keys(consolidated).length > 0 && !loading && (
        <div>
          {Object.keys(consolidated).sort().map((sym, idx) => {
            // consolidated[sym] => { breakout_range: "Buy", rsi_v2: "Sell", ... }
            const stratObj = consolidated[sym];
            return (
              <div key={idx} className="mb-3">
                <h5>{sym}</h5>
                <ul>
                  {Object.keys(stratObj).map((st) => (
                    <li key={st}>{st}: {stratObj[st]}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ConsolidatedActionsPage;
'''
# {PAGINA_EJEMPLO}
'''
import React from 'react'

import './../Page.css';

export const EjemploPage = () => {
  return (
    <main className="main-container">
        <section className="left-column">
          <h1 className="heading-primary">Resultado</h1>
          <p>Resultado de la depuración de archivos</p>
        </section>
        <section className="right-column">
          Contenido derecho
        </section>
    </main>
  )
}

'''