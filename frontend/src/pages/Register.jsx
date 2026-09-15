import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Popup from '../components/Popup'

function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [popup, setPopup] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: 'OK',
        onConfirm: null
    })

    function closePopup() {
        setPopup(prev => ({
            ...prev,
            isOpen: false
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!name || !email || !password) {
            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Missing Information',
                message: 'All fields are required.',
                confirmText: 'OK',
                onConfirm: closePopup
            })
            return
        }

        if (password.length < 6) {
            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Password Too Short',
                message: 'Password must be at least 6 characters.',
                confirmText: 'OK',
                onConfirm: closePopup
            })
            return
        }

        try {
            const response = await fetch(
                '/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )

            const data = await response.json()

            console.log('REGISTER RESPONSE:', data)

            if (!response.ok) {
                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Registration Failed',
                    message: data.error || 'Unable to create your account.',
                    confirmText: 'Try Again',
                    onConfirm: closePopup
                })
                return
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            console.log(
                'TOKEN SAVED:',
                localStorage.getItem('token') ? 'YES' : 'NO'
            )

            console.log(
                'USER SAVED:',
                localStorage.getItem('user') ? 'YES' : 'NO'
            )

            setName('')
            setEmail('')
            setPassword('')

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'Registration Successful',
                message: 'Your account has been created successfully. Welcome to Skill Exchange!',
                confirmText: 'Continue',
                onConfirm: () => {
                    closePopup()
                    navigate('/profile')
                    window.location.reload()
                }
            })

        } catch (error) {
            console.error('Registration error:', error)

            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Connection Error',
                message: 'Unable to connect to server. Please try again.',
                confirmText: 'OK',
                onConfirm: closePopup
            })
        }
    }

    return (
        <main className="auth-page">

            <section className="auth-container">

                <div className="auth-visual">

                    <div className="auth-orbit auth-orbit-one">
                        💡
                    </div>

                    <div className="auth-orbit auth-orbit-two">
                        🤝
                    </div>

                    <div className="auth-orbit auth-orbit-three">
                        🚀
                    </div>

                    <div className="auth-visual-center">
                        <span>JOIN</span>
                        <strong>EXCHANGE</strong>
                    </div>

                </div>

                <div className="auth-card">

                    <div className="auth-card-header">

                        <div className="auth-icon">
                            ✨
                        </div>

                        <span className="auth-eyebrow">
                            JOIN THE COMMUNITY
                        </span>

                        <h1>
                            Create your
                            <br />
                            <span>learning profile.</span>
                        </h1>

                        <p>
                            Share what you know, discover new skills,
                            and connect with students who want to learn.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >

                        <div className="auth-field">

                            <label>
                                Full Name
                            </label>

                            <div className="auth-input-wrapper">

                                <span>
                                    👤
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                        </div>

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
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                            <small className="auth-helper-text">
                                Password must contain at least 6 characters.
                            </small>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                        >
                            Create My Account
                            <span>→</span>
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>ALREADY A MEMBER?</span>
                    </div>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <Link to="/login">
                            Login here
                        </Link>
                    </p>

                </div>

            </section>

            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                confirmText={popup.confirmText}
                onConfirm={popup.onConfirm || closePopup}
            />

        </main>
    )
}

export default Register