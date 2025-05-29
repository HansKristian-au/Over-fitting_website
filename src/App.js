import {Link, Route, Routes} from 'react-router-dom'
import  AddPredictors  from './Pages/addPredictors.js'
import UnivariatePreScreening from './Pages/page2.js'
import Correctives from './Pages/correctives.js'
import Navbar from './layout_components/Navbar.js'

function App() {
  return (
   <>
    <nav>
      <ul>
        <li>
          <Link to="/">Add_Predictors</Link>
        </li>
        <li>
          <Link to="/page2">Univariate_Pre-testing</Link>
        </li>
        <li>
          <Link to="/correctives">Correctives</Link>
        </li>
      </ul>
    </nav>
    
    <Routes>
      <Route path="/" element={<AddPredictors />} />
      <Route path="/page2" element={<UnivariatePreScreening />} />
      <Route path="/correctives" element={<Correctives />} />
    </Routes>
  </>  
  )
}

function App1() {
  return (
   <>
    <Navbar />
    <Routes>
      <Route path="/" element={<AddPredictors />} />
      <Route path="/page2" element={<UnivariatePreScreening />} />
      <Route path="/correctives" element={<Correctives />} />
    </Routes>
  </>  
  )
}



export default App1



 