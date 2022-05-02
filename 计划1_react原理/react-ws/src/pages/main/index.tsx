import React from 'react';
import { useNavigate } from 'react-router-dom';

const routes = [
  {
    path: '/HOC',
    name: '高阶'
  },
  {
    path: '/404',
    name: '404'
  },
]

/**
 * main
 */
export function Main(props: any) {

  const navigate = useNavigate();

  const onToPage = (path: string) => {
    navigate(path);
  }

  return (
    <div>
      {routes.map((item) => {
        return (
          <div>
            <button onClick={() => onToPage(item.path)}>{item.name}</button>
          </div>
        )
      })}
    </div>
  );
}