import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const APIMenuTree = '/api/catalog_system/pub/category/tree/1';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuList: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    axios.get(APIMenuTree).then(resp => {
      this.setState({ menuList: resp.data, isLoaded: true });
    });
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <menu>
          <ul>
            {this.state.menuList.map((el, i) => {
              return (
                <li key={i}>
                  <a href={el.url} titel={el.Title}>
                    {' '}
                    {el.name}{' '}
                  </a>{' '}
                </li>
              );
            })}
          </ul>
        </menu>
      );
    }
    return <li>Carregando ...</li>;
  }
}

ReactDOM.render(<Menu />, document.getElementById('menu'));
