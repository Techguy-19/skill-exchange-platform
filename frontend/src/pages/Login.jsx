
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        if (email === '' || password === '') {
            alert('Please enter email and password')
            return
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.error)
                return
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            alert('Login successful')

            setEmail('')
            setPassword('')

            navigate('/profile')
            window.location.reload()

        } catch (error) {
            console.error('Login error:', error)
            alert('Unable to connect to server')
        }
    }

    return (
        <main className="auth-page">

            <section className="auth-container">

                <div className="auth-visual">

                    <div className="auth-orbit auth-orbit-one">
                        💻
                    </div>

                    <div className="auth-orbit auth-orbit-two">
                        🚀
                    </div>

                    <div className="auth-orbit auth-orbit-three">
                        📚
                    </div>

                    <div className="auth-visual-center">
                        <span>SKILL</span>
                        <strong>EXCHANGE</strong>
                    </div>

                </div>

                <div className="auth-card">

                    <div className="auth-card-header">

                        <div className="auth-icon">
                            👋
                        </div>

                        <span className="auth-eyebrow">
                            WELCOME BACK
                        </span>

                        <h1>
                            Continue your
                            <br />
                            <span>learning journey.</span>
                        </h1>

                        <p>
                            Login to discover skills, connect with
                            students, and exchange knowledge.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">

                        <div className="auth-field">

                            <label>
                                Email Address
                            </label>

                            <div className="auth-input-wrapper">

                                <span>
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        <div className="auth-field">

                            <label>
                                Password
                            </label>

                            <div className="auth-input-wrapper">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                        >
                            Login to Skill Exchange
                            <span>→</span>
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>NEW TO SKILL EXCHANGE?</span>
                    </div>

                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                </div>

            </section>

        </main>
    )
}

export default Login

