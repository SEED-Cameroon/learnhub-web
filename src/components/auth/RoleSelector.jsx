export default function RoleSelector({ role, setRole, error }) {
  return (
    <div className="role-group">
      <label>Role</label>

      <div className="role-options">
        <button
          type="button"
          className={`role-option ${role === "student" ? "selected" : ""}`}
          onClick={() => setRole("student")}
        >
          <span className="role-icon">≡ƒÄô</span>

          <span>
            <strong>Student</strong>
            <small>I'm here to learn</small>
          </span>
        </button>

        <button
          type="button"
          className={`role-option ${role === "tutor" ? "selected" : ""}`}
          onClick={() => setRole("tutor")}
        >
          <span className="role-icon">≡ƒæ¿ΓÇì≡ƒÅ½</span>

          <span>
            <strong>Tutor</strong>
            <small>I'm here to teach</small>
          </span>
        </button>
      </div>

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
