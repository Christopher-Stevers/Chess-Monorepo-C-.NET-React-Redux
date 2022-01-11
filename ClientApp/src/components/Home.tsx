import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>
    <h1>Hello, world!</h1>
    <p>Welcome to my chess app built with:</p>
    <ul>
      <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
      <li><a href='https://facebook.github.io/react/'>React</a> and <a href='https://redux.js.org/'>Redux</a> for client-side code</li>
      <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
    </ul>
    <p>Currently only the frontend application is functional. I hope to add castling, and better check and checkmate functionality (currently to win, you have to click on a piece on your turn that is attacking the other king). Longer term I'm going to build out a backend and web sockets to allow multiplayer games. I hope to build a 3d version eventually as well.</p>
    </div>
);

export default connect()(Home);
