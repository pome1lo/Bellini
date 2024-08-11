import './App.css'
import { Route, Routes } from 'react-router-dom';


function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={}>
                    <Route index element={<MainPage/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
