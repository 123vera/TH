import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routerConfig from './routes'
import './App.css'
import { Fragment } from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        {/* <h1>Vite + React</h1> */}

        <div>
          {
            routerConfig.map((route, key) => {
              return (
                <Fragment key={key}>
                  <a href={`${route.path}`}>{route.pathName}</a> |
                </Fragment>
              )
            })
          }
        </div>
        <Routes>
          {
            routerConfig.map((route) => {
              const { path, component: Component } = route
              return (
                <Route key={route.path} path={path} element={<Component />} />
              )
            })
          }
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
