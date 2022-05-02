import React from 'react';
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';
import { Main } from '../pages/main';
import { HOC } from '../pages/HOC/index';
import { P404 } from '../pages/p404/index';

const routesConfig = [
  {
    path: '/',
    element: <Main />,
    children: []
  },
  {
    path: 'HOC',
    title: '高阶组件',
    element: <HOC />,
    children: []
  },
  {
    path: '404',
    title: '404',
    element: <P404 />,
  },
];

export const AppRoutes = () => {
  const generateRoute = (routes: any) => {
    return routes.map((route: any) => {
      if (route.children !== undefined && route.children.length) {

        return (
          <Route key={route.path} path={route.path}>
            {generateRoute(route.children)}
            <Route index={true} element={route.element} />
          </Route>
        );
      }

      return <Route key={route.path} path={route.path} element={route.element} />;
    });
  };

  return (
    <HashRouter>
      <Routes>
        <Route path='/'>
          {generateRoute(routesConfig)}
        </Route>
      </Routes>
    </HashRouter>
  );
};
