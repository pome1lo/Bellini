import './App.css'
import { Route, Routes } from 'react-router-dom';
import {BasicLayout} from "./layouts/BasicLayout.tsx";
import {MainPage} from "./views/pages/MainPage.tsx";


function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<BasicLayout/>}>
                    <Route index element={<MainPage/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
