import "./LoginPage.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, login } from "../api/api";
import { useUser } from "../context/useUser";

import type { SubmitEventHandler } from "react";
import type { LoginInput } from "../api/api";

type LoginForm = LoginInput;
type FormErrors = Partial<Record<keyof LoginForm, string>>;

function getApiErrorMessage(err: ApiError): string {
  const body = err.body as { error?: string; message?: string } | undefined;
  return body?.error || body?.message || err.message || "Login failed";
}

function isInvalidCredentialsError(err: ApiError): boolean {
  if (err.status !== 400) return false;
  const msg = getApiErrorMessage(err).toLowerCase();
  return msg.includes("invalid email or password");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(values: LoginForm): FormErrors {
    const next: FormErrors = {};

    const email = values.email.trim();
    if (!email) {
      next.email = "Email is a required field";
    } else if (!email.includes("@")) {
      next.email = "Email must contain @";
    }

    if (!values.password) {
      next.password = "Password is a required field";
    }

    return next;
  }

  function setField<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setServerError(null);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setServerError(null);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);

      const user = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setUser(user);

      navigate("/bikes", { replace: true });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const msg = getApiErrorMessage(err);

        if (isInvalidCredentialsError(err)) {
          setServerError("Invalid email or password");
          return;
        }

        setServerError(msg);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to book your ride</p>

          <form onSubmit={onSubmit} className="auth-form">
            {serverError && (
              <div className="alert alert-error">{serverError}</div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? "input-error" : ""}`}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@example.com"
                disabled={submitting}
                required
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                className={`input ${errors.password ? "input-error" : ""}`}
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Enter your Password"
                disabled={submitting}
                required
              />
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <button
              className="button button-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
