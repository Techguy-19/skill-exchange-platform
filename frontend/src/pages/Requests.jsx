
import { useEffect, useState } from 'react'

function Requests() {
    const [requests, setRequests] = useState([])

    const currentUser = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    async function loadRequests() {
        if (!token) {
            return
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/requests',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.error)
                return
            }

            setRequests(data)

        } catch (error) {
            console.error('Error fetching requests:', error)
        }
    }

    useEffect(() => {
        loadRequests()
    }, [])

    async function updateStatus(id, status) {
        try {
            const response = await fetch(
                `http://localhost:5000/api/requests/${id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.error)
                return
            }

            alert(
                status === 'accepted'
                    ? 'Request accepted successfully'
                    : 'Request rejected successfully'
            )

            loadRequests()

        } catch (error) {
            console.error('Error updating request:', error)
            alert('Unable to connect to server')
        }
    }

    function getStatusClass(status) {
        if (status === 'accepted') {
            return 'request-status accepted'
        }

        if (status === 'rejected') {
            return 'request-status rejected'
        }

        return 'request-status pending'
    }

    function getStatusIcon(status) {
        if (status === 'accepted') {
            return '✓'
        }

        if (status === 'rejected') {
            return '×'
        }

        return '⏳'
    }

    if (!currentUser) {
        return (
            <main className="requests-page">

                <section className="requests-login-state">

                    <div className="requests-login-icon">
                        🔐
                    </div>

                    <span className="requests-eyebrow">
                        SKILL EXCHANGE
                    </span>

                    <h1>
                        Your learning
                        <br />
                        <span>journey awaits.</span>
                    </h1>

                    <p>
                        Login to view your skill exchange requests,
                        connect with students, and continue learning
                        together.
                    </p>

                    <a href="/login">
                        <button className="requests-login-btn">
                            Login to Continue →
                        </button>
                    </a>

                </section>

            </main>
        )
    }

    return (
        <main className="requests-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="requests-hero">

                <div className="requests-hero-content">

                    <span className="requests-eyebrow">
                        CONNECT • EXCHANGE • GROW
                    </span>

                    <h1>
                        Your skill
                        <br />
                        <span>exchange requests.</span>
                    </h1>

                    <p>
                        Manage your learning connections, respond to
                        requests, and keep growing together with other
                        students.
                    </p>

                </div>

                <div className="requests-hero-visual">

                    <div className="request-floating-icon request-icon-one">
                        📚
                    </div>

                    <div className="request-floating-icon request-icon-two">
                        🤝
                    </div>

                    <div className="request-floating-icon request-icon-three">
                        🚀
                    </div>

                    <div className="requests-hero-circle">

                        <span>LEARN</span>
                        <strong>TOGETHER</strong>

                    </div>

                </div>

            </section>

            {/* =========================================
                REQUEST SUMMARY
            ========================================= */}

            <section className="requests-summary">

                <div className="request-summary-card">

                    <div className="summary-icon">
                        📩
                    </div>

                    <div>
                        <strong>{requests.length}</strong>
                        <span>Total Requests</span>
                    </div>

                </div>

                <div className="request-summary-card">

                    <div className="summary-icon pending-icon">
                        ⏳
                    </div>

                    <div>
                        <strong>
                            {
                                requests.filter(
                                    (request) =>
                                        request.status === 'pending'
                                ).length
                            }
                        </strong>

                        <span>Pending</span>
                    </div>

                </div>

                <div className="request-summary-card">

                    <div className="summary-icon accepted-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            {
                                requests.filter(
                                    (request) =>
                                        request.status === 'accepted'
                                ).length
                            }
                        </strong>

                        <span>Accepted</span>
                    </div>

                </div>

                <div className="request-summary-card">

                    <div className="summary-icon rejected-icon">
                        ×
                    </div>

                    <div>
                        <strong>
                            {
                                requests.filter(
                                    (request) =>
                                        request.status === 'rejected'
                                ).length
                            }
                        </strong>

                        <span>Rejected</span>
                    </div>

                </div>

            </section>

            {/* =========================================
                REQUEST LIST
            ========================================= */}

            <section className="requests-list-section">

                <div className="requests-section-heading">

                    <div>
                        <span>YOUR CONNECTIONS</span>

                        <h2>
                            Skill exchange
                            <br />
                            <strong>requests.</strong>
                        </h2>
                    </div>

                    <p>
                        Accept a request to start learning from
                        another student.
                    </p>

                </div>

                {requests.length === 0 ? (

                    <div className="requests-empty">

                        <div className="empty-request-icon">
                            📭
                        </div>

                        <h2>
                            No requests yet
                        </h2>

                        <p>
                            Explore available skills and send your
                            first exchange request.
                        </p>

                        <a href="/skills">
                            <button className="browse-skills-btn">
                                Explore Skills →
                            </button>
                        </a>

                    </div>

                ) : (

                    <div className="requests-grid">

                        {requests.map((request) => {

                            const isReceiver =
                                request.receiver.id === currentUser.id

                            const isSender =
                                request.sender.id === currentUser.id

                            return (
                                <article
                                    className="request-card"
                                    key={request.id}
                                >

                                    {/* Card top */}

                                    <div className="request-card-top">

                                        <div className="request-type">

                                            <span className="request-type-icon">
                                                🔄
                                            </span>

                                            <div>
                                                <span>
                                                    SKILL EXCHANGE
                                                </span>

                                                <strong>
                                                    {isReceiver
                                                        ? 'Incoming Request'
                                                        : 'Your Request'}
                                                </strong>
                                            </div>

                                        </div>

                                        <div
                                            className={getStatusClass(
                                                request.status
                                            )}
                                        >
                                            <span>
                                                {getStatusIcon(
                                                    request.status
                                                )}
                                            </span>

                                            {request.status}
                                        </div>

                                    </div>

                                    {/* People */}

                                    <div className="request-people">

                                        <div className="request-person">

                                            <div className="request-avatar">
                                                {request.sender.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <span>
                                                    FROM
                                                </span>

                                                <strong>
                                                    {request.sender.name}
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="request-arrow">
                                            →
                                        </div>

                                        <div className="request-person">

                                            <div className="request-avatar">
                                                {request.receiver.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <span>
                                                    TO
                                                </span>

                                                <strong>
                                                    {request.receiver.name}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                    {/* Exchange */}

                                    <div className="exchange-skills">

                                        <div className="exchange-skill offered">

                                            <span>
                                                OFFERING
                                            </span>

                                            <strong>
                                                💡{' '}
                                                {request.offered_skill.name}
                                            </strong>

                                            <small>
                                                {request.offered_skill.category}
                                            </small>

                                        </div>

                                        <div className="exchange-symbol">
                                            ⇄
                                        </div>

                                        <div className="exchange-skill requested">

                                            <span>
                                                REQUESTING
                                            </span>

                                            <strong>
                                                🎯{' '}
                                                {request.requested_skill.name}
                                            </strong>

                                            <small>
                                                {request.requested_skill.category}
                                            </small>

                                        </div>

                                    </div>

                                    {/* Footer */}

                                    <div className="request-card-footer">

                                        <div className="request-role">

                                            {isReceiver ? (
                                                <>
                                                    <span>
                                                        Someone wants to
                                                        learn from you
                                                    </span>

                                                    <strong>
                                                        Review this request
                                                    </strong>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        Waiting for response
                                                    </span>

                                                    <strong>
                                                        Your request has been sent
                                                    </strong>
                                                </>
                                            )}

                                        </div>

                                        {isReceiver &&
                                            request.status === 'pending' && (

                                                <div className="request-actions">

                                                    <button
                                                        className="accept-request-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                request.id,
                                                                'accepted'
                                                            )
                                                        }
                                                    >
                                                        ✓ Accept
                                                    </button>

                                                    <button
                                                        className="reject-request-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                request.id,
                                                                'rejected'
                                                            )
                                                        }
                                                    >
                                                        × Reject
                                                    </button>

                                                </div>

                                            )}

                                        {isSender &&
                                            request.status === 'pending' && (

                                                <div className="waiting-badge">
                                                    ⏳ Waiting for response
                                                </div>

                                            )}

                                    </div>

                                </article>
                            )
                        })}

                    </div>

                )}

            </section>

        </main>
    )
}

export default Requests
