import './App.css'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Service from './components/Service.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import CreateProblem from './components/CreateProblem.jsx';
import Problem from './components/Problem.jsx';
import UpdateProblem from './components/UpdateProblem.jsx'; 
import DeleteProblem from './components/DeleteProblem.jsx';
import Profile from './components/Profile.jsx';


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
    {
      path : "/create",
      element :
      <>
      <Navbar/>
      <CreateProblem/>
      <Footer/>
      </>
    },
    {
      path : "/problem/:title",
      element :
      <>
      <Navbar/>
      <Problem/>
      <Footer/>
      </>
    },
    {
      path :"/update",
      element :
      <>
      <Navbar/>
      <UpdateProblem/>
      <Footer/>
      </>
    },
    {
      path :"/delete",
      element :
      <>
      <Navbar/>
      <DeleteProblem/>
      <Footer/>
      </>
    },
    {
      path : "/profile",
      element :
      <>
      <Navbar/>
      <Profile/>
      <Footer/>
      </>
    }
    
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
