import { render, screen } from "@testing-library/react";
import SignUpPage from "../pages/SignUpPage";

// If your component uses useNavigate and Link, wrap with MemoryRouter:
import { MemoryRouter } from "react-router-dom";

test("renders the Sign Up page UI", () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: /create account/i }),
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /create account/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
});
