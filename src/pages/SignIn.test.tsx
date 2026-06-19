import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignIn from "@/pages/SignIn";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

import { supabase } from "@/integrations/supabase/client";

function renderSignIn(initialPath = "/sign-in") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/planning" element={<div>Planning</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function fillAndSubmit(email = "test@example.com", password = "password123") {
  fireEvent.change(screen.getByLabelText("E-Mail"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/passwort/i), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: /anmelden/i }));
}

describe("SignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signInWithPassword with form values", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn();
    fillAndSubmit("user@example.com", "secret123");

    await waitFor(() =>
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret123",
      })
    );
  });

  it("shows error message when credentials are wrong", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: "Invalid login credentials" } as any,
    } as any);

    renderSignIn();
    fillAndSubmit();

    await waitFor(() =>
      expect(
        screen.getByText("E-Mail oder Passwort ungültig.")
      ).toBeInTheDocument()
    );
  });

  it("disables submit button while loading", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
      () => new Promise(() => {})
    );

    renderSignIn();
    fillAndSubmit();

    expect(screen.getByRole("button", { name: /anmelden/i })).toBeDisabled();
  });

  it("redirects to / by default after successful login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn();
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
    );
  });

  it("redirects to redirect param after successful login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn("/sign-in?redirect=%2Fplanning");
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("Planning")).toBeInTheDocument()
    );
  });
});
