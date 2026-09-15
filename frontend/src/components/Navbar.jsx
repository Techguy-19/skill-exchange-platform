
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    function closeMenu() {
        setMenuOpen(false)
    }

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        alert('Logged out successfully')

        closeMenu()
        navigate('/login')
        window.location.reload()
    }

    return (
        <nav className="navbar">

            <Link
                to="/"
                className="navbar-logo"
                onClick={closeMenu}
            >
                <span>Skill</span> Exchange
            </Link>

            <button
                className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>

                <Link to="/" onClick={closeMenu}>
                    Home
                </Link>

                <Link to="/skills" onClick={closeMenu}>
                    Explore Skills
                </Link>

                <Link to="/requests" onClick={closeMenu}>
                    Requests
                </Link>

                {user ? (
                    <>
                        <Link to="/profile" onClick={closeMenu}>
                            {user.name}
                        </Link>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>
                            Login
                        </Link>

                        <Link to="/register" onClick={closeMenu}>
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    )
}

export default Navbar

