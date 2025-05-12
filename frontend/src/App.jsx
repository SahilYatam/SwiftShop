import Navbar from "./components/Navbar.jsx"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"

function App() {

  return (
    <div className="min-h-screen text-white overflow-hidden absolute top-0 left-1/2 -translate-x-1/2 w-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]">
        <div>
            {/* <Navbar/> */}
             {/*<HomePage/> */}
            <LoginPage/>
        </div>
    </div>
  )
}

export default App
