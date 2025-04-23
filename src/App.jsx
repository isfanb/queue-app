import { Route, Routes } from 'react-router-dom';
import Home from './Component/Home';
import './App.css'

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/area/:id" element= {<Home/>} />
        </Routes>
    </div>
  )
}

export default App
