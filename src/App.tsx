import '../node_modules/leaflet/dist/leaflet.css'
import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import MapPage from "./pages/MapPage.tsx";


function App() {
  return (
    <>
       <BrowserRouter>
           <Routes>
               <Route path={'/'} element={<Navigate to="/map?transportType=" replace />} />
               <Route path={'/map'} element={<MapPage/>} />
           </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
