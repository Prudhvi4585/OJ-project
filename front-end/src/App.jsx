import './App.css'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Service from './components/Service.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      element:
      <>
      <Navbar/> 
      <Home />,
      <Footer/>
      </>
    },
    {
      path: "/about",
      element:
      <>
       <Navbar/>
       <About />,
       <Footer/>
      </>
    },
    {
      path : "/service/:id",
      element :
      <>
      <Navbar/>
      <Service />
      <Footer/>
      </> 
    },
    {
      path : "/login",
      element :
      <>
      <Navbar/>
      <Login />
      <Footer/>
      </>
    }, 
    {
      path : "/signup",
      element :
      <>
      <Navbar/>
      <Signup/>
      <Footer/>
      </>
    },
  ]);

  return (
    <>
    {/* <Navbar/> */}
    <RouterProvider router={router} />
    {/* <Footer/> */}
    </>
  )
}

export default App
