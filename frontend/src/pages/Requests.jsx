
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from '../components/Popup'

function Requests() {

    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [selectedRequest, setSelectedRequest] = useState(null)

    const [popup, setPopup] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        showCancel: false,
        onConfirm: null,
        onCancel: null
    })

    const currentUser = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    function closePopup() {
        setPopup(prev => ({
            ...prev,
            isOpen: false
        }))
    }

    async function loadRequests() {

        if (!token) {
            return
        }

        try {

            const response = await fetch(
                '/api/requests',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Unable to Load Requests',
                    message: data.error || 'Failed to load requests.',
                    confirmText: 'OK',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            // Debug hidden chat values
            console.log(
                'HIDDEN FLAGS:',
                data.map(request => ({
                    id: request.id,
                    status: request.status,
                    sender_chat_hidden:
                        request.sender_chat_hidden,
                    receiver_chat_hidden:
                        request.receiver_chat_hidden
                }))
            )

            // Request cards ko display karne ke liye required
            setRequests(data)

        } catch (error) {

            console.error(
                'Error fetching requests:',
                error
            )

            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Connection Error',
                message: 'Unable to connect to server. Please try again.',
                confirmText: 'OK',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })
        }
    }

    useEffect(() => {
        loadRequests()
    }, [])

    async function updateStatus(id, status) {

        try {

            const response = await fetch(
                `/api/requests/${id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Unable to Update Request',
                    message: data.error || 'Failed to update request.',
                    confirmText: 'OK',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            setSelectedRequest(null)

            setPopup({
                isOpen: true,
                type: 'success',
                title:
                    status === 'accepted'
                        ? 'Request Accepted'
                        : 'Request Rejected',
                message:
                    status === 'accepted'
                        ? 'The skill exchange request has been accepted successfully.'
                        : 'The skill exchange request has been rejected successfully.',
                confirmText: 'Continue',
                showCancel: false,
                onConfirm: () => {
                    closePopup()
                    loadRequests()
                },
                onCancel: closePopup
            })

        } catch (error) {

            console.error(
                'Error updating request:',
                error
            )

            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Connection Error',
                message: 'Unable to connect to server. Please try again.',
                confirmText: 'OK',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })
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

                        <span>
                            LEARN
                        </span>

                        <strong>
                            TOGETHER
                        </strong>

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

                        <strong>
                            {requests.length}
                        </strong>

                        <span>
                            Total Requests
                        </span>

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
                                    request =>
                                        request.status === 'pending'
                                ).length
                            }
                        </strong>

                        <span>
                            Pending
                        </span>

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
                                    request =>
                                        request.status === 'accepted'
                                ).length
                            }
                        </strong>

                        <span>
                            Accepted
                        </span>

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
                                    request =>
                                        request.status === 'rejected'
                                ).length
                            }
                        </strong>

                        <span>
                            Rejected
                        </span>

                    </div>

                </div>

            </section>


            {/* =========================================
                REQUEST LIST
            ========================================= */}

            <section className="requests-list-section">

                <div className="requests-section-heading">

                    <div>

                        <span>
                            YOUR CONNECTIONS
                        </span>

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
                                Number(request.receiver.id) ===
                                Number(currentUser.id)

                            const isSender =
                                Number(request.sender.id) ===
                                Number(currentUser.id)

                            return (

                                <article
                                    className="request-card"
                                    key={request.id}
                                    onClick={() =>
                                        setSelectedRequest(request)
                                    }
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


            {/* =========================================
                REQUEST MODAL
            ========================================= */}

            {selectedRequest && (

                <div
                    className="request-modal-overlay"
                    onClick={() =>
                        setSelectedRequest(null)
                    }
                >

                    <div
                        className="request-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="request-modal-close"
                            onClick={() =>
                                setSelectedRequest(null)
                            }
                        >
                            ×
                        </button>


                        <h2>
                            Skill Exchange Request
                        </h2>


                        <p>
                            <strong>
                                From:
                            </strong>{' '}
                            {selectedRequest.sender.name}
                        </p>


                        <p>
                            <strong>
                                To:
                            </strong>{' '}
                            {selectedRequest.receiver.name}
                        </p>


                        <p>
                            <strong>
                                Offering:
                            </strong>{' '}
                            {selectedRequest.offered_skill.name}
                        </p>


                        <p>
                            <strong>
                                Requesting:
                            </strong>{' '}
                            {selectedRequest.requested_skill.name}
                        </p>


                        <p>
                            <strong>
                                Status:
                            </strong>{' '}
                            {selectedRequest.status}
                        </p>


                        <p>
                            <strong>
                                Sent:
                            </strong>{' '}
                            {new Date(
                                selectedRequest.created_at
                            ).toLocaleString()}
                        </p>


                        {selectedRequest.accepted_at && (

                            <p>

                                <strong>
                                    Accepted:
                                </strong>{' '}

                                {new Date(
                                    selectedRequest.accepted_at
                                ).toLocaleString()}

                            </p>

                        )}


                        {selectedRequest.rejected_at && (

                            <p>

                                <strong>
                                    Rejected:
                                </strong>{' '}

                                {new Date(
                                    selectedRequest.rejected_at
                                ).toLocaleString()}

                            </p>

                        )}


                        {/* =========================================
                            ACCEPT / REJECT
                            ONLY PENDING INCOMING REQUEST
                        ========================================= */}

                        {Number(selectedRequest.receiver.id) ===
                            Number(currentUser.id) &&
                            selectedRequest.status === 'pending' && (

                                <div className="request-actions">

                                    <button
                                        className="accept-request-btn"
                                        onClick={(e) => {

                                            e.stopPropagation()

                                            updateStatus(
                                                selectedRequest.id,
                                                'accepted'
                                            )

                                        }}
                                    >
                                        ✓ Accept
                                    </button>


                                    <button
                                        className="reject-request-btn"
                                        onClick={(e) => {

                                            e.stopPropagation()

                                            updateStatus(
                                                selectedRequest.id,
                                                'rejected'
                                            )

                                        }}
                                    >
                                        × Reject
                                    </button>

                                </div>

                            )}


                        {/* =========================================
                            ACCEPTED REQUEST
                            CHAT STATUS
                        ========================================= */}

                        {selectedRequest.status === 'accepted' && (

                            (() => {

                                const isSender =
                                    Number(selectedRequest.sender.id) ===
                                    Number(currentUser.id)

                                const chatHidden = isSender
                                    ? selectedRequest.sender_chat_hidden === true
                                    : selectedRequest.receiver_chat_hidden === true

                                console.log(
                                    'SELECTED REQUEST CHAT CHECK:',
                                    {
                                        requestId: selectedRequest.id,
                                        isSender,
                                        sender_chat_hidden:
                                            selectedRequest.sender_chat_hidden,
                                        receiver_chat_hidden:
                                            selectedRequest.receiver_chat_hidden,
                                        chatHidden
                                    }
                                )


                                if (chatHidden) {

                                    return (

                                        <div className="chat-hidden-section">

                                            <div className="chat-hidden-message">
                                                🔕 Chat hidden
                                            </div>


                                            <button
                                                className="unhide-chat-btn"
                                                onClick={async () => {

                                                    try {

                                                        const response =
                                                            await fetch(
                                                                `/api/messages/${selectedRequest.id}/unhide`,
                                                                {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        Authorization: `Bearer ${token}`
                                                                    }
                                                                }
                                                            )

                                                        const data =
                                                            await response.json()

                                                        if (!response.ok) {

                                                            throw new Error(
                                                                data.error ||
                                                                'Failed to unhide chat'
                                                            )
                                                        }


                                                        // Update current request

                                                        setSelectedRequest(prev => ({

                                                            ...prev,

                                                            sender_chat_hidden:
                                                                isSender
                                                                    ? false
                                                                    : prev.sender_chat_hidden,

                                                            receiver_chat_hidden:
                                                                isSender
                                                                    ? prev.receiver_chat_hidden
                                                                    : false

                                                        }))


                                                        // Update request list

                                                        setRequests(prev =>
                                                            prev.map(request =>
                                                                request.id === selectedRequest.id
                                                                    ? {
                                                                        ...request,

                                                                        sender_chat_hidden:
                                                                            isSender
                                                                                ? false
                                                                                : request.sender_chat_hidden,

                                                                        receiver_chat_hidden:
                                                                            isSender
                                                                                ? request.receiver_chat_hidden
                                                                                : false
                                                                    }
                                                                    : request
                                                            )
                                                        )

                                                    } catch (error) {

                                                        setPopup({
                                                            isOpen: true,
                                                            type: 'error',
                                                            title: 'Unable to Unhide Chat',
                                                            message: error.message,
                                                            confirmText: 'OK',
                                                            showCancel: false,
                                                            onConfirm: closePopup,
                                                            onCancel: closePopup
                                                        })

                                                    }

                                                }}
                                            >
                                                ↩️ Unhide Chat
                                            </button>

                                        </div>

                                    )
                                }


                                return (

                                    <div className="chat-button-wrapper">

                                        <button
                                            className="open-chat-btn"
                                            onClick={() => {

                                                navigate(
                                                    `/chat/${selectedRequest.id}`
                                                )

                                                setSelectedRequest(null)

                                            }}
                                        >
                                            💬 Open Chat
                                        </button>

                                    </div>

                                )

                            })()

                        )}

                    </div>

                </div>

            )}


            {/* =========================================
                CUSTOM POPUP
            ========================================= */}

            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                confirmText={popup.confirmText}
                cancelText={popup.cancelText}
                showCancel={popup.showCancel}
                onConfirm={popup.onConfirm || closePopup}
                onCancel={popup.onCancel || closePopup}
            />

        </main>
    )
}

export default Requests

