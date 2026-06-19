import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        setError("E-Mail konnte nicht gesendet werden.");
        return;
      }
      setInfo(
        "Wir haben dir eine E-Mail geschickt. Folge dem Link, um ein Passwort zu setzen.",
      );
      return;
    }

    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-Mail oder Passwort ungültig.");
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/";
    navigate(redirect);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <LogIn className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {mode === "signin" ? "Anmelden" : "Passwort zurücksetzen"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Melde dich mit deiner E-Mail-Adresse und deinem Passwort an."
              : "Gib deine E-Mail ein – wir senden dir einen Link, um ein neues Passwort zu setzen."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
              />
            </div>
            {mode === "signin" && (
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {info && <p className="text-sm text-muted-foreground">{info}</p>}
            <Button type="submit" className="w-full" disabled={loading} aria-label="Anmelden">
              <LogIn className="mr-2 h-4 w-4" />
              {loading
                ? "Bitte warten…"
                : mode === "signin"
                  ? "Anmelden"
                  : "Link senden"}
            </Button>
            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setError(null);
                setInfo(null);
                setMode(mode === "signin" ? "forgot" : "signin");
              }}
            >
              {mode === "signin"
                ? "Passwort vergessen?"
                : "Zurück zur Anmeldung"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
