import './App.css';
import { useEffect } from 'react';
import routes from "./routes"
import Header from './components/Header/Header'

function App() {

  return (
    <div className="App">
      <Header />
      {routes}
    </div>
  );
}

export default App;