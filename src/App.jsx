import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import PhotoViewer from '@pages/PhotoViewer'
import Collections from '@pages/Collections'
import People from '@pages/People'
import './App.css'

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/collections">Collections</Link>
          <Link to="/people">People</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/collections" element={<Collections />} />
          <Route path="/people" element={<People />} />
          <Route path="/photos/:collection" element={<PhotoViewer />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
