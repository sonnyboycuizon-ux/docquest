import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Logo in the public folder (public/cc.png)
const logoImage = '/cc.png'

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-reg {
    --primary: #000435;
    --secondary: #2563EB;
    --accent: #F4B400;
    --bg: #F8FAFC;
    --text: #1E293B;
    --muted: #64748B;
    --border: #E2E8F0;
    --input-border: #CBD5E1;
    --error: #DC2626;
    --success: #16A34A;

    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    background: var(--bg);
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: var(--text);
    overflow: hidden;
  }
  .dq-reg *, .dq-reg *::before, .dq-reg *::after { box-sizing: border-box; }
  .dq-reg :where(h1, h2, h3, p) { margin: 0; }

  .dq-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .35; pointer-events: none; }
  .dq-blob-1 { width: 340px; height: 340px; background: #93C5FD; top: -90px; left: -90px; }
  .dq-blob-2 { width: 300px; height: 300px; background: #FEF08A; bottom: -70px; right: -70px; }

  .dq-wrap { position: relative; z-index: 1; width: 100%; max-width: 720px; align-self: flex-start; }

  /* ---------- CARD ---------- */
  .dq-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(0, 4, 53, .12);
    overflow: hidden;
  }
  .dq-top { height: 6px; background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent)); }

  .dq-head {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 30px 36px 24px;
    border-bottom: 1px solid var(--border);
  }
  .dq-logo {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid #fff;
    background: var(--primary);
    color: var(--accent);
    font-size: 26px;
    font-weight: 800;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 4, 53, .25);
  }
  .dq-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
  .dq-head h1 { color: var(--primary); font-size: 24px; font-weight: 800; letter-spacing: -.4px; margin-bottom: 4px; }
  .dq-head p { color: var(--muted); font-size: 14px; line-height: 1.5; }

  .dq-body { padding: 8px 36px 34px; }

  /* ---------- SECTIONS ---------- */
  .dq-section { padding: 22px 0 6px; }
  .dq-section + .dq-section { border-top: 1px solid var(--border); margin-top: 16px; }
  .dq-section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    color: var(--primary);
    font-size: 15px;
    font-weight: 800;
  }
  .dq-section-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #EFF6FF;
    color: var(--secondary);
  }

  .dq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 18px; }
  .dq-grid.three { grid-template-columns: 1fr 1fr 1fr; }
  .dq-full { grid-column: 1 / -1; }
  .dq-field { margin-bottom: 0; }

  .dq-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; color: var(--text); }
  .dq-req { color: var(--error); margin-left: 2px; }
  .dq-optional { font-weight: 400; color: var(--muted); font-size: 12px; }

  .dq-input {
    width: 100%;
    height: 46px;
    padding: 0 14px;
    border: 1px solid var(--input-border);
    border-radius: 10px;
    background: #fff;
    color: var(--text);
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .dq-input::placeholder { color: #94A3B8; }
  .dq-input:hover:not(:disabled) { border-color: #94A3B8; }
  .dq-input:focus { border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(37, 99, 235, .15); }
  .dq-input:disabled { background: #F1F5F9; cursor: not-allowed; }
  .dq-input.is-invalid { border-color: var(--error); }
  .dq-input.is-invalid:focus { box-shadow: 0 0 0 3px rgba(220, 38, 38, .15); }

  select.dq-input {
    appearance: none;
    padding-right: 38px;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }

  .dq-help { display: block; margin-top: 6px; font-size: 12px; line-height: 1.45; color: var(--muted); }
  .dq-help.bad { color: var(--error); }
  .dq-help.ok { color: #166534; }

  /* Password toggle */
  .dq-pw { position: relative; }
  .dq-pw .dq-input { padding-right: 46px; }
  .dq-toggle {
    position: absolute; top: 5px; right: 5px; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border: none; border-radius: 8px; background: transparent; color: var(--muted); cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .dq-toggle:hover:not(:disabled) { background: #F1F5F9; color: var(--primary); }
  .dq-toggle:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); outline-offset: 1px; }
  .dq-toggle:disabled { opacity: .5; cursor: not-allowed; }

  /* Strength meter */
  .dq-meter { display: flex; gap: 5px; margin-top: 9px; }
  .dq-seg { flex: 1; height: 4px; border-radius: 999px; background: var(--border); transition: background .2s ease; }
  .dq-seg.weak { background: var(--error); }
  .dq-seg.fair { background: var(--accent); }
  .dq-seg.good { background: var(--secondary); }
  .dq-seg.strong { background: var(--success); }

  /* ---------- ALERT ---------- */
  .dq-alert {
    display: flex; gap: 12px; margin: 22px 0 0; padding: 14px; border-radius: 12px;
    background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B;
    font-size: 14px; line-height: 1.5; word-break: break-word;
  }
  .dq-alert svg { flex-shrink: 0; margin-top: 1px; }
  .dq-alert strong { display: block; margin-bottom: 2px; }

  /* ---------- SUBMIT ---------- */
  .dq-actions { margin-top: 26px; padding-top: 24px; border-top: 1px solid var(--border); }
  .dq-submit {
    width: 100%; height: 50px; display: flex; align-items: center; justify-content: center; gap: 10px;
    border: none; border-radius: 10px; background: var(--primary); color: #fff;
    font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 4, 53, .22);
    transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
  }
  .dq-submit:hover:not(:disabled) { background: #0a1050; transform: translateY(-1px); }
  .dq-submit:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); outline-offset: 2px; }
  .dq-submit:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; }
  .dq-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff;
    animation: dq-spin .7s linear infinite;
  }
  @keyframes dq-spin { to { transform: rotate(360deg); } }

  .dq-foot { margin-top: 18px; text-align: center; font-size: 14px; color: var(--muted); }
  .dq-foot a { color: var(--secondary); font-weight: 700; text-decoration: none; }
  .dq-foot a:hover { text-decoration: underline; }
  .dq-foot a:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); outline-offset: 2px; border-radius: 4px; }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 640px) {
    .dq-reg { padding: 16px 12px; }
    .dq-card { border-radius: 20px; }
    .dq-head { padding: 24px 22px 20px; }
    .dq-head h1 { font-size: 21px; }
    .dq-body { padding: 4px 22px 28px; }
    .dq-grid, .dq-grid.three { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .dq-reg * { transition: none !important; animation: none !important; }
  }
`

const svg = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const UserIcon = () => (
  <svg {...svg}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>
)
const CapIcon = () => (
  <svg {...svg}><path d="m22 9-10-5L2 9l10 5 10-5z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></svg>
)
const MailIcon = () => (
  <svg {...svg}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
const LockIcon = () => (
  <svg {...svg}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
)
const AlertIcon = () => (
  <svg {...svg} width="20" height="20"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
)
const EyeIcon = () => (
  <svg {...svg} width="19" height="19"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
)
const EyeOffIcon = () => (
  <svg {...svg} width="19" height="19">
    <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 4.06-5.06" />
    <path d="M9.9 5.24A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="m2 2 20 20" />
  </svg>
)

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    studentId: '',
    course: '',
    studentStatus: 'student',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const {
      firstName,
      middleInitial,
      lastName,
      studentId,
      course,
      studentStatus,
      email,
      phone,
      password,
      confirmPassword,
    } = formData

    // Clean values
    const cleanFirstName = firstName.trim()
    const cleanMiddleInitial = middleInitial.trim()
    const cleanLastName = lastName.trim()
    const cleanStudentId = studentId.trim()
    const cleanCourse = course.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()

    // Required fields
    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanStudentId ||
      !cleanCourse ||
      !studentStatus ||
      !cleanEmail ||
      !cleanPhone ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all required fields.')
      return
    }

    // Password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,

              // Middle Initial is optional.
              // If blank, the database will save it as NULL.
              middle_initial:
                cleanMiddleInitial || null,

              last_name: cleanLastName,
              student_id: cleanStudentId,
              course: cleanCourse,
              phone: cleanPhone,
              student_status: studentStatus,
            },
          },
        })

      if (signUpError) {
        throw signUpError
      }

      if (!data.user) {
        throw new Error(
          'Registration failed. Please try again.'
        )
      }

      /*
       * IMPORTANT:
       * The student should NOT remain logged in after registration.
       *
       * Gmail verification is NO LONGER required during registration.
       * The student can log in immediately.
       */
      await supabase.auth.signOut()

      /*
       * Redirect to Login page.
       *
       * The Login page will display the success message.
       */
      navigate('/login', {
        replace: true,
        state: {
          successMessage:
            'Registration successful! Your account has been created. You can now log in to your DocQuest account.',
        },
      })
    } catch (error) {
      console.error('Registration error:', error)

      const message =
        error?.message?.toLowerCase() || ''

      if (
        message.includes('user already registered') ||
        message.includes('already registered')
      ) {
        setError(
          'An account with this email already exists. Please use another email or log in to your existing account.'
        )
      } else if (
        message.includes('password should be at least')
      ) {
        setError(
          'Password must be at least 6 characters.'
        )
      } else {
        setError(
          error?.message ||
            'Registration failed. Please check your information and try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // ---------- Password helpers ----------
  const { password, confirmPassword } = formData

  const getStrength = () => {
    if (!password) return { level: 0, label: '', tone: '' }
    if (password.length < 6) return { level: 1, label: 'Too short', tone: 'weak' }
    if (password.length < 8) return { level: 2, label: 'Fair', tone: 'fair' }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return { level: 4, label: 'Strong', tone: 'strong' }
    return { level: 3, label: 'Good', tone: 'good' }
  }

  const strength = getStrength()
  const showMatch = confirmPassword.length > 0
  const passwordsMatch = password === confirmPassword

  return (
    <div className="dq-reg">
      <style>{css}</style>

      <div className="dq-blob dq-blob-1" />
      <div className="dq-blob dq-blob-2" />

      <div className="dq-wrap">
        <div className="dq-card">
          <div className="dq-top" />

          {/* HEADER */}
          <div className="dq-head">
            <div className="dq-logo">
              {logoFailed ? (
                'D'
              ) : (
                <img
                  src={logoImage}
                  alt="Consolatrix College Logo"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </div>
            <div>
              <h1>Create your DocQuest account</h1>
              <p>
                Register as a student to request and track registrar
                documents online.
              </p>
            </div>
          </div>

          <div className="dq-body">
            <form onSubmit={handleSubmit} noValidate>
              {/* PERSONAL */}
              <section className="dq-section">
                <h2 className="dq-section-title">
                  <span className="dq-section-icon"><UserIcon /></span>
                  Personal information
                </h2>

                <div className="dq-grid three">
                  <div className="dq-field">
                    <label className="dq-label" htmlFor="firstName">
                      First name<span className="dq-req">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      className="dq-input"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Juan"
                      autoComplete="given-name"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="middleInitial">
                      Middle initial <span className="dq-optional">(optional)</span>
                    </label>
                    <input
                      id="middleInitial"
                      type="text"
                      name="middleInitial"
                      className="dq-input"
                      value={formData.middleInitial}
                      onChange={handleChange}
                      placeholder="C."
                      maxLength={10}
                      disabled={loading}
                    />
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="lastName">
                      Last name<span className="dq-req">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      className="dq-input"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Dela Cruz"
                      autoComplete="family-name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ACADEMIC */}
              <section className="dq-section">
                <h2 className="dq-section-title">
                  <span className="dq-section-icon"><CapIcon /></span>
                  Academic details
                </h2>

                <div className="dq-grid">
                  <div className="dq-field dq-full">
                    <label className="dq-label" htmlFor="studentId">
                      Student ID<span className="dq-req">*</span>
                    </label>
                    <input
                      id="studentId"
                      type="text"
                      name="studentId"
                      className="dq-input"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Enter your student ID"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="course">
                      Course<span className="dq-req">*</span>
                    </label>
                    <select
                      id="course"
                      name="course"
                      className="dq-input"
                      value={formData.course}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="">Select your course</option>
                      <option value="BSIT">Bachelor of Science in Information Technology</option>
                      <option value="BSHM">Bachelor of Science in Hospitality Management</option>
                      <option value="BSENTREP">Bachelor of Science in Entrepreneurship</option>
                      <option value="BEED">Bachelor of Elementary Education</option>
                      <option value="BSED">Bachelor of Secondary Education</option>
                      <option value="BPED">Bachelor of Physical Education</option>
                    </select>
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="studentStatus">
                      Student status<span className="dq-req">*</span>
                    </label>
                    <select
                      id="studentStatus"
                      name="studentStatus"
                      className="dq-input"
                      value={formData.studentStatus}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="student">Current Student</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* CONTACT */}
              <section className="dq-section">
                <h2 className="dq-section-title">
                  <span className="dq-section-icon"><MailIcon /></span>
                  Contact details
                </h2>

                <div className="dq-grid">
                  <div className="dq-field">
                    <label className="dq-label" htmlFor="email">
                      Email / Gmail<span className="dq-req">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="dq-input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="phone">
                      Phone number<span className="dq-req">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="dq-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09XXXXXXXXX"
                      autoComplete="tel"
                      disabled={loading}
                      required
                    />
                  </div>

                  <small className="dq-help dq-full" style={{ marginTop: -6 }}>
                    You can verify this Gmail later in your Profile before
                    requesting documents.
                  </small>
                </div>
              </section>

              {/* SECURITY */}
              <section className="dq-section">
                <h2 className="dq-section-title">
                  <span className="dq-section-icon"><LockIcon /></span>
                  Account security
                </h2>

                <div className="dq-grid">
                  <div className="dq-field">
                    <label className="dq-label" htmlFor="password">
                      Password<span className="dq-req">*</span>
                    </label>
                    <div className="dq-pw">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="dq-input"
                        value={password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="dq-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {password ? (
                      <div aria-live="polite">
                        <div className="dq-meter">
                          {[1, 2, 3, 4].map((n) => (
                            <span
                              key={n}
                              className={`dq-seg${n <= strength.level ? ` ${strength.tone}` : ''}`}
                            />
                          ))}
                        </div>
                        <small className="dq-help">Strength: {strength.label}</small>
                      </div>
                    ) : (
                      <small className="dq-help">Use 8+ characters with a capital letter and a number for a strong password.</small>
                    )}
                  </div>

                  <div className="dq-field">
                    <label className="dq-label" htmlFor="confirmPassword">
                      Confirm password<span className="dq-req">*</span>
                    </label>
                    <div className="dq-pw">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        className={`dq-input${showMatch && !passwordsMatch ? ' is-invalid' : ''}`}
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        disabled={loading}
                        aria-invalid={showMatch && !passwordsMatch ? 'true' : 'false'}
                        required
                      />
                      <button
                        type="button"
                        className="dq-toggle"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        disabled={loading}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {showMatch && (
                      <small
                        className={`dq-help ${passwordsMatch ? 'ok' : 'bad'}`}
                        aria-live="polite"
                      >
                        {passwordsMatch ? 'Passwords match.' : 'Passwords do not match yet.'}
                      </small>
                    )}
                  </div>
                </div>
              </section>

              {error && (
                <div className="dq-alert" role="alert">
                  <AlertIcon />
                  <div>
                    <strong>Registration failed</strong>
                    {error}
                  </div>
                </div>
              )}

              <div className="dq-actions">
                <button type="submit" className="dq-submit" disabled={loading}>
                  {loading && <span className="dq-spinner" />}
                  {loading ? 'Creating account...' : 'Create account'}
                </button>

                <p className="dq-foot">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register