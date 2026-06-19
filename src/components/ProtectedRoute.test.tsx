import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import { ProtectedRoute } from "@/components/ProtectedRoute";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";

function renderWithRouter(authState: { session: any; loading: boolean }) {
  vi.mocked(useAuth).mockReturnValue({
    session: authState.session,
    user: authState.session?.user ?? null,
    loading: authState.loading,
    signOut: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/sign-in" element={<div>Sign In Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders outlet when session exists", () => {
    renderWithRouter({ session: { user: { email: "a@b.com" } }, loading: false });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /sign-in when no session", () => {
    renderWithRouter({ session: null, loading: false });
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    renderWithRouter({ session: null, loading: true });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign In Page")).not.toBeInTheDocument();
  });
});
