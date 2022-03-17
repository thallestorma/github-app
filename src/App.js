import { Component } from 'react';

import AppContent from './components/AppContent';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userinfo: null,
      repos: [],
      starred: [],
    };
  }

  getGitHubApiUrl(username, type) {
    const internalUsername = username ? `/${username}` : '';
    const internalType = type ? `/${type}` : '';
    return `https://api.github.com/users${internalUsername}${internalType}`;
  }

  handleSearch(e) {
    const value = e.target.value;
    // TODO: mudar o atributo do evento (provavelmente e.key), pois os atuais estão obsoletos
    const keyCode = e.which || e.keyCode;
    const ENTER = 13;
    if (keyCode === ENTER) {
      fetch(this.getGitHubApiUrl(value))
        .then((response) => response.json())
        .then(
          (result) => {
            this.setState({
              userinfo: {
                name: result.name,
                photo: result.avatar_url,
                login: result.login,
                repos: result.public_repos,
                followers: result.followers,
                following: result.following,
                username: result.login,
              },
              repos: [],
              starred: [],
            });
          },
          // userinfo: {
          //   name: 'Thalles Torma',
          //   photo: 'https://avatars.githubusercontent.com/u/14226427?v=4',
          //   login: 'thallestorma',
          //   repos: 12,
          //   followers: 10,
          //   following: 5,
          // }
          // repos: [{ name: 'Repo', link: '#' }],
          // starred: [{ name: 'Repo', link: '#' }],
        );
    }
  }

  getRepos(type) {
    return (e) => {
      const username = this.state.userinfo.username;
      fetch(this.getGitHubApiUrl(username, type))
        .then((response) => response.json())
        .then((result) => {
          const repos = result.map((repo) => ({
            name: repo.name,
            link: repo.html_url,
          }));

          this.setState({
            [type]: repos,
          });
        });
    };
  }

  render() {
    return (
      <AppContent
        userinfo={this.state.userinfo}
        repos={this.state.repos}
        starred={this.state.starred}
        handleSearch={(e) => this.handleSearch(e)}
        getRepos={this.getRepos('repos')}
        getStarred={this.getRepos('starred')}
      />
    );
  }
}

export default App;
