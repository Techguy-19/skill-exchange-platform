
import { Link } from 'react-router-dom'

function Home() {
    return (
        <main className="home-page">

            {/* HERO SECTION */}
            <section className="hero">

                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        🚀 Learn • Teach • Grow
                    </div>

                    <h1>
                        Learn a Skill.
                        <br />
                        <span>Share Your Skill.</span>
                        <br />
                        Grow Together.
                    </h1>

                    <p>
                        Connect with fellow students, exchange knowledge,
                        discover new skills, and grow together through
                        real peer-to-peer learning.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/skills">
                            <button className="primary-btn">
                                Explore Skills →
                            </button>
                        </Link>

                        <Link to="/register">
                            <button className="secondary-btn">
                                Start Learning
                            </button>
                        </Link>

                    </div>

                    <div className="hero-stats">

                        <div className="hero-stat">
                            <strong>Learn</strong>
                            <span>New Skills</span>
                        </div>

                        <div className="hero-stat">
                            <strong>Share</strong>
                            <span>Your Knowledge</span>
                        </div>

                        <div className="hero-stat">
                            <strong>Connect</strong>
                            <span>With Students</span>
                        </div>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="floating-card card-one">
                        <span>💻</span>
                        <div>
                            <strong>Web Development</strong>
                            <small>Learn from students</small>
                        </div>
                    </div>

                    <div className="floating-card card-two">
                        <span>🎨</span>
                        <div>
                            <strong>UI / UX Design</strong>
                            <small>Share your creativity</small>
                        </div>
                    </div>

                    <div className="floating-card card-three">
                        <span>🤖</span>
                        <div>
                            <strong>AI & Machine Learning</strong>
                            <small>Grow your future skills</small>
                        </div>
                    </div>

                    <div className="hero-circle">
                        <div className="hero-circle-inner">
                            <span>SKILL</span>
                            <strong>EXCHANGE</strong>
                        </div>
                    </div>

                </div>

            </section>


            {/* CATEGORIES */}
            <section className="learning-section">

                <div className="section-heading">

                    <span>EXPLORE</span>

                    <h2>
                        Discover skills that
                        <br />
                        <span>excite you.</span>
                    </h2>

                    <p>
                        From coding to design, discover something new
                        and find students who can help you learn.
                    </p>

                </div>

                <div className="category-grid">

                    <div className="category-card">
                        <div className="category-icon">💻</div>
                        <h3>Programming</h3>
                        <p>
                            Learn coding, web development and software skills.
                        </p>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🎨</div>
                        <h3>Design</h3>
                        <p>
                            Explore UI/UX, graphics and creative design.
                        </p>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🤖</div>
                        <h3>AI & Technology</h3>
                        <p>
                            Discover AI, data science and emerging technology.
                        </p>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">📈</div>
                        <h3>Business</h3>
                        <p>
                            Build communication, marketing and business skills.
                        </p>
                    </div>

                </div>

            </section>


            {/* HOW IT WORKS */}
            <section className="how-section">

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Learning becomes
                        <br />
                        <span>better together.</span>
                    </h2>

                </div>

                <div className="steps-container">

                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            👤
                        </div>

                        <h3>Create Your Profile</h3>

                        <p>
                            Tell the community what you know and
                            what you want to learn.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            🔍
                        </div>

                        <h3>Find a Skill</h3>

                        <p>
                            Explore skills shared by other students
                            and discover your next learning opportunity.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            🔄
                        </div>

                        <h3>Exchange & Grow</h3>

                        <p>
                            Send an exchange request and learn
                            from each other.
                        </p>

                    </div>

                </div>

            </section>


            {/* MOTIVATION */}
            <section className="motivation-section">

                <div className="motivation-card">

                    <div>

                        <span className="motivation-label">
                            YOUR NEXT SKILL STARTS HERE
                        </span>

                        <h2>
                            Don't just scroll.
                            <br />
                            <span>Start learning.</span>
                        </h2>

                        <p>
                            Every student knows something valuable.
                            Your next opportunity could start with
                            a simple skill exchange.
                        </p>

                        <Link to="/skills">
                            <button className="primary-btn">
                                Find Your Next Skill →
                            </button>
                        </Link>

                    </div>

                    <div className="motivation-visual">
                        <div className="motivation-orbit">
                            <span>💡</span>
                            <span>🚀</span>
                            <span>📚</span>
                            <span>💻</span>
                        </div>

                        <div className="motivation-center">
                            <strong>KEEP</strong>
                            <span>LEARNING</span>
                        </div>
                    </div>

                </div>

            </section>


            {/* FOOTER CTA */}
            <section className="home-footer-cta">

                <h2>
                    Ready to exchange
                    <br />
                    <span>your first skill?</span>
                </h2>

                <p>
                    Join students who are learning, teaching and
                    growing together.
                </p>

                <Link to="/register">
                    <button className="primary-btn">
                        Join Skill Exchange →
                    </button>
                </Link>

            </section>

        </main>
    )
}

export default Home

