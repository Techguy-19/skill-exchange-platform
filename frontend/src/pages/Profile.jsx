import { useEffect, useState } from 'react'
import Popup from '../components/Popup'

function Profile() {

    const [user, setUser] = useState(null)

    const [mySkills, setMySkills] = useState([])

    const [skillName, setSkillName] = useState('')

    const [category, setCategory] = useState('')

    const [description, setDescription] = useState('')

    const [editingSkill, setEditingSkill] = useState(null)

    const [editName, setEditName] = useState('')

    const [editCategory, setEditCategory] = useState('')

    const [editDescription, setEditDescription] = useState('')

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

    const [deleteSkillId, setDeleteSkillId] = useState(null)

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('user'))

        if (storedUser) {

            setUser(storedUser)

            loadMySkills(storedUser.id)

        }

    }, [])

    async function loadMySkills(userId) {

        try {

            const response = await fetch(
                '/api/skills'
            )

            const data = await response.json()

            const userSkills = data.filter(
                (skill) => skill.user_id === userId
            )

            setMySkills(userSkills)

        } catch (error) {

            console.error('Error loading skills:', error)

        }

    }

    function closePopup() {

        setPopup(prev => ({
            ...prev,
            isOpen: false
        }))

    }

    async function handleAddSkill(e) {

        e.preventDefault()

        if (!skillName || !category || !description) {

            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Missing Information',
                message: 'All fields are required.',
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
                '/api/skills',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        name: skillName,
                        category,
                        description
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Unable to Add Skill',
                    message: data.error || 'Something went wrong.',
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            setSkillName('')
            setCategory('')
            setDescription('')

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'Skill Added',
                message: 'Your skill has been added successfully.',
                confirmText: 'Great',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            loadMySkills(user.id)

        } catch (error) {

            console.error('Error adding skill:', error)

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

    function handleDeleteSkill(id) {

        setDeleteSkillId(id)

        setPopup({
            isOpen: true,
            type: 'danger',
            title: 'Delete Skill?',
            message: 'Are you sure you want to delete this skill? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            showCancel: true,
            onConfirm: confirmDeleteSkill,
            onCancel: cancelDeleteSkill
        })

    }

    function cancelDeleteSkill() {

        setDeleteSkillId(null)

        closePopup()

    }

    async function confirmDeleteSkill() {

        const id = deleteSkillId

        setDeleteSkillId(null)

        closePopup()

        if (!id) {
            return
        }

        try {

            const response = await fetch(
                `/api/skills/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Delete Failed',
                    message: data.error || 'Unable to delete this skill.',
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'Skill Deleted',
                message: 'The skill has been deleted successfully.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            loadMySkills(user.id)

        } catch (error) {

            console.error('Error deleting skill:', error)

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

    function startEditSkill(skill) {

        setEditingSkill(skill.id)

        setEditName(skill.name)

        setEditCategory(skill.category)

        setEditDescription(skill.description)

    }

    function cancelEdit() {

        setEditingSkill(null)

        setEditName('')

        setEditCategory('')

        setEditDescription('')

    }

    async function handleUpdateSkill(id) {

        if (!editName || !editCategory || !editDescription) {

            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Missing Information',
                message: 'All fields are required.',
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
                `/api/skills/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        name: editName,
                        category: editCategory,
                        description: editDescription
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Update Failed',
                    message: data.error || 'Unable to update this skill.',
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    showCancel: false,
                    onConfirm: closePopup,
                    onCancel: closePopup
                })

                return
            }

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'Skill Updated',
                message: 'Your skill has been updated successfully.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                showCancel: false,
                onConfirm: closePopup,
                onCancel: closePopup
            })

            cancelEdit()

            loadMySkills(user.id)

        } catch (error) {

            console.error('Error updating skill:', error)

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

    if (!user) {

        return (

            <main className="profile-page">

                <section className="profile-login-state">

                    <div className="profile-login-icon">
                        🔐
                    </div>

                    <span className="profile-eyebrow">
                        SKILL EXCHANGE
                    </span>

                    <h1>
                        Your skills.
                        <br />
                        <span>Your journey.</span>
                    </h1>

                    <p>
                        Login to create your student profile and
                        showcase the skills you can share with others.
                    </p>

                    <a href="/login">
                        <button className="profile-login-btn">
                            Login to Continue →
                        </button>
                    </a>

                </section>

            </main>

        )

    }

    return (

        <main className="profile-page">

            {/* =========================================
                PROFILE HERO
            ========================================= */}

            <section className="profile-hero">

                <div className="profile-hero-card">

                    <div className="profile-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-identity">

                        <span className="profile-eyebrow">
                            STUDENT PROFILE
                        </span>

                        <h1>
                            {user.name}
                        </h1>

                        <p>
                            {user.email}
                        </p>

                        <div className="profile-status">

                            <span></span>

                            Active learner

                        </div>

                    </div>

                    <div className="profile-hero-decoration">

                        <span>📚</span>
                        <span>💡</span>
                        <span>🚀</span>

                    </div>

                </div>

            </section>

            {/* =========================================
                PROFILE STATS
            ========================================= */}

            <section className="profile-stats">

                <div className="profile-stat-card">

                    <div className="profile-stat-icon">
                        🧠
                    </div>

                    <div>

                        <strong>
                            {mySkills.length}
                        </strong>

                        <span>
                            Skills Shared
                        </span>

                    </div>

                </div>

                <div className="profile-stat-card">

                    <div className="profile-stat-icon">
                        🎓
                    </div>

                    <div>

                        <strong>
                            Student
                        </strong>

                        <span>
                            Community Member
                        </span>

                    </div>

                </div>

                <div className="profile-stat-card">

                    <div className="profile-stat-icon">
                        🤝
                    </div>

                    <div>

                        <strong>
                            Learn
                        </strong>

                        <span>
                            Exchange Knowledge
                        </span>

                    </div>

                </div>

            </section>

            {/* =========================================
                ADD SKILL
            ========================================= */}

            <section className="profile-add-section">

                <div className="profile-section-heading">

                    <span>
                        SHARE YOUR KNOWLEDGE
                    </span>

                    <h2>
                        Add a skill
                        <br />
                        <strong>you can teach.</strong>
                    </h2>

                    <p>
                        Share something you know and help another
                        student learn it.
                    </p>

                </div>

                <div className="profile-add-card">

                    <div className="profile-form-icon">
                        ✨
                    </div>

                    <form onSubmit={handleAddSkill}>

                        <div className="profile-form-row">

                            <div className="profile-field">

                                <label>
                                    Skill Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. JavaScript"
                                    value={skillName}
                                    onChange={(e) =>
                                        setSkillName(e.target.value)
                                    }
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    Category
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Programming"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Describe what you can teach..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="profile-add-btn"
                        >
                            Add Skill
                            <span>→</span>
                        </button>

                    </form>

                </div>

            </section>

            {/* =========================================
                MY SKILLS
            ========================================= */}

            <section className="profile-skills-section">

                <div className="profile-section-heading skills-heading">

                    <div>

                        <span>
                            YOUR KNOWLEDGE
                        </span>

                        <h2>
                            My
                            <br />
                            <strong>skills.</strong>
                        </h2>

                    </div>

                    <p>
                        Skills you've shared with the Skill Exchange
                        community.
                    </p>

                </div>

                {mySkills.length === 0 ? (

                    <div className="profile-empty-skills">

                        <div className="profile-empty-icon">
                            💡
                        </div>

                        <h3>
                            Your skill collection is empty
                        </h3>

                        <p>
                            Add your first skill above and start
                            sharing your knowledge with other students.
                        </p>

                    </div>

                ) : (

                    <div className="profile-skill-grid">

                        {mySkills.map((skill) => (

                            <article
                                className="profile-skill-card"
                                key={skill.id}
                            >

                                {editingSkill === skill.id ? (

                                    <div className="profile-edit-mode">

                                        <div className="profile-edit-header">

                                            <span>
                                                EDIT SKILL
                                            </span>

                                            <button
                                                className="profile-edit-close"
                                                onClick={cancelEdit}
                                            >
                                                ×
                                            </button>

                                        </div>

                                        <div className="profile-field">

                                            <label>
                                                Skill Name
                                            </label>

                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) =>
                                                    setEditName(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="profile-field">

                                            <label>
                                                Category
                                            </label>

                                            <input
                                                type="text"
                                                value={editCategory}
                                                onChange={(e) =>
                                                    setEditCategory(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="profile-field">

                                            <label>
                                                Description
                                            </label>

                                            <textarea
                                                value={editDescription}
                                                onChange={(e) =>
                                                    setEditDescription(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="profile-edit-actions">

                                            <button
                                                className="save-skill-btn"
                                                onClick={() =>
                                                    handleUpdateSkill(
                                                        skill.id
                                                    )
                                                }
                                            >
                                                ✓ Save Changes
                                            </button>

                                            <button
                                                className="cancel-skill-btn"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <>

                                        <div className="profile-skill-top">

                                            <div className="profile-skill-icon">

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

                                            <span className="profile-skill-category">
                                                {skill.category}
                                            </span>

                                        </div>

                                        <div className="profile-skill-content">

                                            <h3>
                                                {skill.name}
                                            </h3>

                                            <p>
                                                {skill.description}
                                            </p>

                                        </div>

                                        <div className="profile-skill-footer">

                                            <button
                                                className="edit-skill-btn"
                                                onClick={() =>
                                                    startEditSkill(skill)
                                                }
                                            >
                                                ✎ Edit
                                            </button>

                                            <button
                                                className="delete-skill-btn"
                                                onClick={() =>
                                                    handleDeleteSkill(
                                                        skill.id
                                                    )
                                                }
                                            >
                                                × Delete
                                            </button>

                                        </div>

                                    </>

                                )}

                            </article>

                        ))}

                    </div>

                )}

            </section>

            {/* =========================================
                BOTTOM MESSAGE
            ========================================= */}

            <section className="profile-bottom-message">

                <div>

                    <span>
                        KEEP GROWING
                    </span>

                    <h2>
                        Every skill you share
                        <br />
                        <strong>can help someone grow.</strong>
                    </h2>

                </div>

                <div className="profile-bottom-orbit">

                    <span>💡</span>
                    <span>📚</span>
                    <span>🚀</span>

                </div>

            </section>

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

export default Profile