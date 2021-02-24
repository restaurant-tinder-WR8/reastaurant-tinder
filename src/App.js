import './App.css';
import { useEffect } from 'react';
import routes from "./routes"
import Header from './components/Header/Header'

function App() {
  // useEffect(() => {
  //   window.addEventListener("unload", () => console.log('RAN'));
  //   return () => {
  //     window.removeEventListener("unload", () => console.log('RAN'));
  //   }
  // }, [])

  return (
    <div className="App" onbeforeunload={() => alert('hey')}>
      <Header />
      {routes}
    </div>
  );
}

export default App;