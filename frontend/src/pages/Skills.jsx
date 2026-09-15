import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from '../components/Popup'

function Skills() {

    const [skills, setSkills] = useState([])

    const [mySkills, setMySkills] = useState([])

    const [search, setSearch] = useState('')

    const [selectedSkill, setSelectedSkill] = useState(null)

    const [offeredSkillId, setOfferedSkillId] = useState('')

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

    const navigate = useNavigate()

    useEffect(() => {
        loadSkills()
    }, [])

    function closePopup() {
        setPopup(prev => ({
            ...prev,
            isOpen: false
        }))
    }

    async function loadSkills() {

        try {

            const response = await fetch(
                '/api/skills'
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Unable to Load Skills',
                    message: data.error || 'Unable to load skills.',
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            setSkills(data)

            if (currentUser) {

                const ownSkills = data.filter(
                    (skill) => skill.user_id === currentUser.id
                )

                setMySkills(ownSkills)

            }

        } catch (error) {

            console.error('Error fetching skills:', error)

        }

    }

    function openExchange(skill) {

        if (!currentUser) {

            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Login Required',
                message: 'Please login first to request a skill exchange.',
                confirmText: 'Login',
                cancelText: 'Cancel',
                showCancel: true,
                onConfirm: () => {
                    closePopup()
                    navigate('/login')
                },
                onCancel: closePopup
            })

            return
        }

        if (skill.user_id === currentUser.id) {

            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Your Own Skill',
                message: 'You cannot request your own skill.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            return
        }

        if (mySkills.length === 0) {

            setPopup({
                isOpen: true,
                type: 'info',
                title: 'Add a Skill First',
                message: 'Please add a skill to your profile before requesting an exchange.',
                confirmText: 'Go to Profile',
                cancelText: 'Cancel',
                showCancel: true,
                onConfirm: () => {
                    closePopup()
                    navigate('/profile')
                },
                onCancel: closePopup
            })

            return
        }

        setSelectedSkill(skill)

        setOfferedSkillId('')

    }

    function closeExchange() {

        setSelectedSkill(null)

        setOfferedSkillId('')

    }

    async function sendRequest() {

        if (!offeredSkillId) {

            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Select a Skill',
                message: 'Please select a skill to offer.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            return
        }

        const offeredSkill = mySkills.find(
            (skill) => String(skill.id) === String(offeredSkillId)
        )

        if (!offeredSkill) {

            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Invalid Skill',
                message: 'The selected skill is invalid. Please select another skill.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            return
        }

        try {

            const response = await fetch(
                '/api/requests',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        receiver_id: selectedSkill.user_id,
                        offered_skill_id: offeredSkill.id,
                        requested_skill_id: selectedSkill.id
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Request Failed',
                    message: data.error || 'Unable to send exchange request.',
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            closeExchange()

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'Exchange Request Sent',
                message: `Request sent successfully!\n\nYou offer: ${offeredSkill.name}\nYou want: ${selectedSkill.name}`,
                confirmText: 'Great',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

        } catch (error) {

            console.error('Error sending request:', error)

            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Connection Error',
                message: 'Unable to connect to server. Please try again.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

        }

    }

    const filteredSkills = skills.filter((skill) =>
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.category.toLowerCase().includes(search.toLowerCase())
    )

    return (

        <main className="skills-page">

            {/* HERO */}

            <section className="skills-hero">

                <div className="skills-hero-content">

                    <span className="skills-eyebrow">
                        EXPLORE • LEARN • CONNECT
                    </span>

                    <h1>
                        Discover skills.
                        <br />
                        <span>Learn from students.</span>
                    </h1>

                    <p>
                        Explore skills shared by students, discover
                        something new, and exchange knowledge with
                        people who can help you grow.
                    </p>

                </div>

                <div className="skills-hero-orbit">

                    <div className="orbit-icon orbit-one">
                        💻
                    </div>

                    <div className="orbit-icon orbit-two">
                        🎨
                    </div>

                    <div className="orbit-icon orbit-three">
                        🤖
                    </div>

                    <div className="skills-hero-center">
                        <span>LEARN</span>
                        <strong>TOGETHER</strong>
                    </div>

                </div>

            </section>


            {/* SEARCH */}

            <section className="skills-discovery">

                <div className="skills-search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search for a skill or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (

                        <button
                            className="clear-search"
                            onClick={() => setSearch('')}
                        >
                            ×
                        </button>

                    )}

                </div>

                <div className="skills-result-info">

                    <div>

                        <strong>
                            {filteredSkills.length}
                        </strong>

                        <span>
                            {filteredSkills.length === 1
                                ? ' skill available'
                                : ' skills available'}
                        </span>

                    </div>

                    {search && (

                        <span className="search-result-text">
                            Results for "{search}"
                        </span>

                    )}

                </div>

            </section>


            {/* SKILL CARDS */}

            <section className="skills-list-section">

                {filteredSkills.length === 0 ? (

                    <div className="empty-skills">

                        <div className="empty-icon">
                            🔎
                        </div>

                        <h2>
                            {search
                                ? 'No skills found'
                                : 'No skills available yet'}
                        </h2>

                        <p>
                            {search
                                ? 'Try searching for another skill or category.'
                                : 'Be the first student to share a skill!'}
                        </p>

                    </div>

                ) : (

                    <div className="modern-skill-grid">

                        {filteredSkills.map((skill) => {

                            const isOwnSkill =
                                currentUser &&
                                skill.user_id === currentUser.id

                            return (

                                <article
                                    className="modern-skill-card"
                                    key={skill.id}
                                >

                                    <div className="skill-card-top">

                                        <div className="skill-icon">

                                            {skill.category
                                                ?.toLowerCase()
                                                .includes('program')
                                                ? '💻'
                                                : skill.category
                                                    ?.toLowerCase()
                                                    .includes('design')
                                                    ? '🎨'
                                                    : skill.category
                                                        ?.toLowerCase()
                                                        .includes('business')
                                                        ? '📈'
                                                        : skill.category
                                                            ?.toLowerCase()
                                                            .includes('ai')
                                                            ? '🤖'
                                                            : '✨'}

                                        </div>

                                        <span className="skill-category">
                                            {skill.category}
                                        </span>

                                    </div>


                                    <div className="skill-card-content">

                                        <h2>
                                            {skill.name}
                                        </h2>

                                        <p>
                                            {skill.description}
                                        </p>

                                    </div>


                                    <div className="skill-owner">

                                        <div className="owner-avatar">

                                            {skill.user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || '?'}

                                        </div>

                                        <div className="owner-info">

                                            <span>
                                                Skill shared by
                                            </span>

                                            {skill.user ? (

                                                <button
                                                    className="owner-name"
                                                    onClick={() => {

                                                        if (!currentUser) {

                                                            setPopup({
                                                                isOpen: true,
                                                                type: 'warning',
                                                                title: 'Login Required',
                                                                message: 'Please login first to view student profiles.',
                                                                confirmText: 'Login',
                                                                cancelText: 'Cancel',
                                                                showCancel: true,
                                                                onConfirm: () => {
                                                                    closePopup()
                                                                    navigate('/login')
                                                                },
                                                                onCancel: closePopup
                                                            })

                                                            return
                                                        }

                                                        navigate(
                                                            `/user/${skill.user.id}`
                                                        )

                                                    }}
                                                >
                                                    {skill.user.name}
                                                </button>

                                            ) : (

                                                <strong>
                                                    Unknown
                                                </strong>

                                            )}

                                        </div>

                                    </div>


                                    <div className="skill-card-footer">

                                        {isOwnSkill ? (

                                            <div className="own-skill-badge">
                                                ✓ Your Skill
                                            </div>

                                        ) : (

                                            <button
                                                className="request-skill-btn"
                                                onClick={() =>
                                                    openExchange(skill)
                                                }
                                            >
                                                Request Exchange
                                                <span>→</span>
                                            </button>

                                        )}

                                    </div>

                                </article>

                            )

                        })}

                    </div>

                )}

            </section>


            {/* EXCHANGE MODAL */}

            {selectedSkill && (

                <div
                    className="exchange-overlay"
                    onClick={closeExchange}
                >

                    <div
                        className="exchange-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="exchange-close"
                            onClick={closeExchange}
                        >
                            ×
                        </button>


                        <div className="exchange-modal-icon">
                            🔄
                        </div>

                        <span className="skills-eyebrow">
                            SKILL EXCHANGE
                        </span>

                        <h2>
                            Exchange knowledge
                        </h2>

                        <p className="exchange-description">
                            Choose one of your skills to offer
                            in exchange for the skill you want.
                        </p>


                        <div className="exchange-summary">

                            <div className="exchange-item">

                                <span>
                                    YOU WANT
                                </span>

                                <strong>
                                    {selectedSkill.name}
                                </strong>

                                <small>
                                    from {selectedSkill.user?.name}
                                </small>

                            </div>

                            <div className="exchange-arrow">
                                ⇄
                            </div>

                            <div className="exchange-item">

                                <span>
                                    YOU OFFER
                                </span>

                                <strong>
                                    {offeredSkillId
                                        ? mySkills.find(
                                            (skill) =>
                                                String(skill.id) ===
                                                String(offeredSkillId)
                                        )?.name
                                        : 'Choose a skill'}
                                </strong>

                                <small>
                                    Your knowledge
                                </small>

                            </div>

                        </div>


                        <label className="exchange-label">
                            Select your skill
                        </label>

                        <select
                            className="exchange-select"
                            value={offeredSkillId}
                            onChange={(e) =>
                                setOfferedSkillId(e.target.value)
                            }
                        >

                            <option value="">
                                -- Select your skill --
                            </option>

                            {mySkills.map((skill) => (

                                <option
                                    key={skill.id}
                                    value={skill.id}
                                >
                                    {skill.name}
                                </option>

                            ))}

                        </select>


                        <div className="exchange-actions">

                            <button
                                className="exchange-send-btn"
                                onClick={sendRequest}
                            >
                                Send Exchange Request →
                            </button>

                            <button
                                className="exchange-cancel-btn"
                                onClick={closeExchange}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* CUSTOM POPUP */}

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

export default Skills