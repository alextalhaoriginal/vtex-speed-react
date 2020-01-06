# VTEX SPEED COM REACT E ES6

Olá Dev, beleza?
Esse é um repositório livre. aqui você vai encontrar uma base para começar a desenvolver seus layouts na plataforma #vtex. Nesse ambiente você vai ter as seguintes ferramentas:

- Suporte ao vtex speed: prox da vtex onde é possível subir um servidor local e fazer ajustes em tempo real sem precisar usar proxy como fiddle ou charles
- PUG: O PUG é um template engine, com ele você pode criar seus templates de forma dinâmica.
- ReactJS: O tão famoso React JS, a lib do facebook que conquistou grande espaço no mundo front end. O React permite que você crie componentes de fácil reaproveitamento.

## Como começar

Para começar a usar esse ambiente a primeira coisa que você deve fazer é clonar esse repositório para sua máquina.

1. Modifique o `accountName: "account-name"` no arquivo package.json para o account name da sua loja
2. Digite `npm i` ou `yarn` para instalar todas as dependências do projeto
3. Após a instalação dos pacotes você já pode rodar o `npm start` ou `yarn start` para rodar o seu ambiente local.
4. faça suas alterações e implementações
5. No final basta digital `npm run build` ou `yarn build` para gerar os arquivos finais e fazer o upload na vtex.

## Como funciona o React JS

Não seria bom para SEO ter uma página inteira componente. Também não seria bom ter sua lojas como SPA. Para resolver esses problemas a vtex teria que dar suporte a SSR (Server Side Rendering) o que implica na edição do servidor back end.

Para evitar SEO ruim, recomendo usar o React JS apenas para componentes que tenham algum tipo de interação. Por exemplo, não é necessário substituir o controle de descrição do produto por um componente que pega essa informação via API. É melhor para o SEO ter essa informação vindo direto no HTML assim que a página é renderizada.

O React vai demorar alguns milésimos de segundo para buscar essa informação na API e renderizar na tela, é uma diferença imperceptível para quem está navegando mas não para os robôs do Google.

Em contrapartida seria muito mais interessante fazer a busca auto-complete com React aplicando novas soluções para essa funcionalidade.

Dentro da pasta `src/js/modules` eu preparei alguns exemplos de utilização. Imagine que eu tenho um componente de título, esse componente será renderizado dentro de uma div com id "title". O código fica mais ou menos assim.

```javascript
import React from "react";
import ReactDOM from "react-dom";

/**
 * Componente
 */
const MainTitle = props => {
  return <h1>Olá mundo, essa é minha loja {props.name}!</h1>;
};

/**
 *  Renderizar o compoente no container title
 */
ReactDOM.render(
  <MainTitle name="SapatosLindos.com" />,
  document.getElementById("title")
);
```

e esse seria o index.pug

```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Document
    body

        header
            #titel

    script(src="/arquivos/main-store.min.js")
```

Na pasta `src/js` o arquivo `index.js` deverá importar todos os arquivos JS. Esse arquivo gera o arquivo final.
