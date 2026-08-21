import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import RoleSelector from "../../components/auth/RoleSelector";
import AuthMessage from "../../components/auth/AuthMessage";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (!role) {
      newErrors.role = "Please select a role.";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      /*
       * Replace this simulated request with your real API
       * when the backend endpoint is available.
       */
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMessage("Account created successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setMessage(
        "Unable to create your account. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout activePage="signup">
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          error={errors.name}
        />

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

        <RoleSelector
          role={role}
          setRole={setRole}
          error={errors.role}
        />

        <AuthMessage
          type={messageType}
          message={message}
        />

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link-button"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}