import {Link, Route, Routes} from 'react-router-dom'
import  AddPredictors  from './Pages/addPredictors.js'
import UnivariatePreScreening from './Pages/page2.js'
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
      </ul>
    </nav>
    
    <Routes>
      <Route path="/" element={<AddPredictors />} />
      <Route path="/page2" element={<UnivariatePreScreening />} />
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
    </Routes>
  </>  
  )
}



export default App1



 