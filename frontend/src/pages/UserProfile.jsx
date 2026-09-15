import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Popup from '../components/Popup'

function UserProfile() {

    const { id } = useParams()

    const [user, setUser] = useState(null)
    const [skills, setSkills] = useState([])

    const [popup, setPopup] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: 'OK',
        onConfirm: null
    })

    useEffect(() => {
        loadUserProfile()
    }, [id])

    function closePopup() {
        setPopup(prev => ({
            ...prev,
            isOpen: false
        }))
    }

    async function loadUserProfile() {

        try {

            const response = await fetch(
                '/api/skills'
            )

            const data = await response.json()

            if (!response.ok) {

                setPopup({
                    isOpen: true,
                    type: 'error',
                    title: 'Unable to Load Profile',
                    message: data.error || 'Unable to load user profile.',
                    confirmText: 'OK',
                    onConfirm: closePopup
                })

                return
            }

            const userSkills = data.filter(
                (skill) => String(skill.user_id) === String(id)
            )

            if (userSkills.length > 0) {

                setUser(userSkills[0].user)
                setSkills(userSkills)

            }

        } catch (error) {

            console.error('Error loading user profile:', error)

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

    if (!user) {

        return (

            <>

                <section className="profile">

                    <h1>User Profile</h1>

                    <p>
                        User not found or has no skills listed.
                    </p>

                </section>

                <Popup
                    isOpen={popup.isOpen}
                    type={popup.type}
                    title={popup.title}
                    message={popup.message}
                    confirmText={popup.confirmText}
                    onConfirm={popup.onConfirm || closePopup}
                />

            </>

        )

    }

    return (

        <>

            <section className="profile">

                <h1>
                    {user.name}'s Profile
                </h1>

                <div className="profile-card">

                    <h2>
                        {user.name}
                    </h2>

                </div>

                <h2>
                    Skills
                </h2>

                {skills.length === 0 ? (

                    <p>
                        This user has not added any skills yet.
                    </p>

                ) : (

                    <div className="skill-container">

                        {skills.map((skill) => (

                            <div
                                className="skill-card"
                                key={skill.id}
                            >

                                <h3>
                                    {skill.name}
                                </h3>

                                <p>
                                    <strong>
                                        Category:
                                    </strong>{' '}
                                    {skill.category}
                                </p>

                                <p>
                                    {skill.description}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                confirmText={popup.confirmText}
                onConfirm={popup.onConfirm || closePopup}
            />

        </>

    )

}

export default UserProfile