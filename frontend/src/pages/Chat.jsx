import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Chat() {

    const { requestId } = useParams()
    const navigate = useNavigate()

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editingText, setEditingText] = useState('')

    const currentUser = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')


    // =========================================
    // LOAD MESSAGES
    // =========================================

    const loadMessages = async () => {

        try {

            const response = await fetch(
                `/api/messages/${requestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to load messages'
                )
            }

            setMessages(data)

        } catch (error) {

            alert(error.message)

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {

        loadMessages()

    }, [requestId])


    // =========================================
    // SEND MESSAGE
    // =========================================

    const sendMessage = async (e) => {

        e.preventDefault()

        if (!message.trim()) {
            return
        }

        try {

            const response = await fetch(
                `/api/messages/${requestId}`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        message: message.trim()
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to send message'
                )
            }

            setMessages(prev => [...prev, data])

            setMessage('')

        } catch (error) {

            alert(error.message)

        }
    }


    // =========================================
    // EDIT MESSAGE
    // =========================================

    const startEditing = (msg) => {

        setEditingMessageId(msg.id)
        setEditingText(msg.message)

    }


    const cancelEditing = () => {

        setEditingMessageId(null)
        setEditingText('')

    }


    const saveEditedMessage = async (messageId) => {

        if (!editingText.trim()) {
            return
        }

        try {

            const response = await fetch(
                `/api/messages/${messageId}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        message: editingText.trim()
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to edit message'
                )
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? data
                        : msg
                )
            )

            cancelEditing()

        } catch (error) {

            alert(error.message)

        }
    }


    // =========================================
    // DELETE MESSAGE
    // =========================================

    const deleteMessage = async (messageId) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this message?'
        )

        if (!confirmed) {
            return
        }

        try {

            const response = await fetch(
                `/api/messages/${messageId}`,
                {
                    method: 'DELETE',

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to delete message'
                )
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            deleted: true
                        }
                        : msg
                )
            )

        } catch (error) {

            alert(error.message)

        }
    }


    // =========================================
    // MESSAGE TIME
    // =========================================

    const formatMessageTime = (date) => {

        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })

    }


    // =========================================
    // DATE LABEL
    // =========================================

    const getDateLabel = (date) => {

        const messageDate = new Date(date)

        const today = new Date()

        const yesterday = new Date()

        yesterday.setDate(today.getDate() - 1)


        if (
            messageDate.toDateString() ===
            today.toDateString()
        ) {

            return 'Today'

        }


        if (
            messageDate.toDateString() ===
            yesterday.toDateString()
        ) {

            return 'Yesterday'

        }


        return messageDate.toLocaleDateString([], {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })

    }


    // =========================================
    // CHAT UI
    // =========================================

    return (

        <div className="chat-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="chat-header">

                <button
                    className="chat-back-btn"
                    onClick={() => navigate('/requests')}
                >
                    ←
                </button>


                <div>

                    <h1>
                        💬 Skill Exchange Chat
                    </h1>

                    <p>
                        Request #{requestId}
                    </p>

                </div>

<button
    className="hide-chat-btn"
    onClick={async () => {

        const confirmed = window.confirm(
            'Hide this chat from your requests? Messages will remain saved.'
        )

        if (!confirmed) {
            return
        }

        try {

            const response = await fetch(
                `/api/messages/${requestId}/hide`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to hide chat'
                )
            }

            navigate('/requests')

        } catch (error) {

            alert(error.message)

        }
    }}
>
    🗑️ Hide Chat
</button>






            </div>






            {/* =========================================
                MESSAGES
            ========================================= */}

            <div className="chat-messages">


                {loading ? (

                    <div className="chat-empty">
                        Loading messages...
                    </div>

                ) : messages.length === 0 ? (

                    <div className="chat-empty">

                        <div>💬</div>

                        <h3>
                            No messages yet
                        </h3>

                        <p>
                            Start the conversation!
                        </p>

                    </div>

                ) : (

                    messages.map((msg, index) => {

                        const previousMessage =
                            messages[index - 1]

                        const showDate =
                            !previousMessage ||
                            new Date(msg.created_at)
                                .toDateString() !==
                            new Date(previousMessage.created_at)
                                .toDateString()


                        const isMine =
                            Number(msg.sender_id) ===
                            Number(currentUser?.id)


                        return (

                            <div key={msg.id}>


                                {/* DATE */}

                                {showDate && (

                                    <div className="chat-date-divider">

                                        {getDateLabel(
                                            msg.created_at
                                        )}

                                    </div>

                                )}


                                {/* MESSAGE ROW */}

                                <div
                                    className={`message-row ${
                                        isMine
                                            ? 'my-message'
                                            : 'other-message'
                                    }`}
                                >

                                    <div className="message-wrapper">


                                        {/* =================================
                                            DELETED MESSAGE
                                        ================================= */}

                                        {msg.deleted ? (

                                            <div className="message-bubble deleted-message">

                                                <p>
                                                    This message was deleted
                                                </p>

                                                <span>
                                                    {formatMessageTime(
                                                        msg.created_at
                                                    )}
                                                </span>

                                            </div>

                                        ) : editingMessageId === msg.id ? (

                                            /* =================================
                                               EDIT MODE
                                            ================================= */

                                            <div className="message-edit-box">

                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) =>
                                                        setEditingText(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />

                                                <div className="message-edit-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            saveEditedMessage(
                                                                msg.id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            cancelEditing
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        ) : (

                                            /* =================================
                                               NORMAL MESSAGE
                                            ================================= */

                                            <>

                                                <div className="message-bubble">

                                                    <p>
                                                        {msg.message}
                                                    </p>

                                                    <span>
                                                        {formatMessageTime(
                                                            msg.created_at
                                                        )}

                                                        {msg.edited && (
                                                            <> · edited</>
                                                        )}
                                                    </span>

                                                </div>


                                                {/* ACTIONS — OWN MESSAGE ONLY */}

                                                {isMine && (

                                                    <div className="message-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEditing(
                                                                    msg
                                                                )
                                                            }
                                                        >
                                                            ✏️
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteMessage(
                                                                    msg.id
                                                                )
                                                            }
                                                        >
                                                            🗑️
                                                        </button>

                                                    </div>

                                                )}

                                            </>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )

                    })

                )}

            </div>


            {/* =========================================
                MESSAGE INPUT
            ========================================= */}

            <form
                className="chat-input-area"
                onSubmit={sendMessage}
            >

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />


                <button type="submit">
                    Send
                </button>

            </form>


        </div>

    )

}

export default Chat