import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, register } from "../api/api";
import type { RegisterInput } from "../api/api";

type SignUpForm = RegisterInput & { confirmPassword: string };
type FormErrors = Partial<Record<keyof SignUpForm, string>>;

export default function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({}); // input / validation errors
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(values: SignUpForm): FormErrors {
    const next: FormErrors = {};

    if (!values.name.trim()) {
      next.name = "Name is a required field";
    }

    const email = values.email.trim();
    if (!email) {
      next.email = "Email is a required field";
    } else if (!email.includes("@")) {
      next.email = "Email must contain @";
    }

    if (!values.password) {
      next.password = "Password is a required field";
    } else if (values.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!values.confirmPassword) {
      next.password = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
      next.confirmPassword = "Passwords do not match";
    }

    return next;
  }

  function setField<K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setServerError(null);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setSuccessMsg("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 700);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const msg = err.message || "Registration failed";

        if (
          err.status === 400 &&
          msg.toLowerCase().includes("email already in use")
        ) {
          setServerError("Duplicate email. Please use another email address");
        } else {
          setServerError(msg);
        }
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and start booking bikes</p>

          <form onSubmit={onSubmit} className="auth-form">
            {serverError && (
              <div className="alert alert-error">{serverError}</div>
            )}
            {successMsg && (
              <div className="alert alert-success">{successMsg}</div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="John Doe"
                disabled={submitting}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@example.com"
                disabled={submitting}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Minimum 6 characters"
                disabled={submitting}
              />
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                className="input"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                disabled={submitting}
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              className="button button-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
