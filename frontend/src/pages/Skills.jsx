
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Skills() {
    const [skills, setSkills] = useState([])
    const [mySkills, setMySkills] = useState([])
    const [search, setSearch] = useState('')

    const [selectedSkill, setSelectedSkill] = useState(null)
    const [offeredSkillId, setOfferedSkillId] = useState('')

    const currentUser = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    useEffect(() => {
        loadSkills()
    }, [])

    async function loadSkills() {
        try {
            const response = await fetch(
                '/api/skills'
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.error)
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
            alert('Please login first')
            return
        }

        if (skill.user_id === currentUser.id) {
            alert('You cannot request your own skill')
            return
        }

        if (mySkills.length === 0) {
            alert('Please add a skill to your profile first')
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
            alert('Please select a skill to offer')
            return
        }

        const offeredSkill = mySkills.find(
            (skill) => String(skill.id) === String(offeredSkillId)
        )

        if (!offeredSkill) {
            alert('Invalid skill selected')
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
                alert(data.error)
                return
            }

            alert(
                `Request sent successfully!\n\nYou offer: ${offeredSkill.name}\nYou want: ${selectedSkill.name}`
            )

            closeExchange()

        } catch (error) {
            console.error('Error sending request:', error)
            alert('Unable to connect to server')
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
                                                            alert('Please login first')
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

        </main>
    )
}

export default Skills

