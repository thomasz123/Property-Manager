import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-2xl rounded-full text-blue-800">
            cribs
          </Link>
        </div> 

        <div className="navbar-end">
          <Link to="/login" className="btn btn-ghost rounded-full">
            <span>Login</span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Navbar
