import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Componente
 */
const MainTitle = props => {
  return <h1>Olá mundo, essa é minha loja {props.name}!</h1>;
};

/**
 *  Renderizar o compoente no container title
 */
ReactDOM.render(<MainTitle name="SapatosLindos.com" />, document.getElementById('title'));
