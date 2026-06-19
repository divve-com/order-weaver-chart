import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });

    (async () => {
      // 1) Newer flows use ?code=... (PKCE) or ?token_hash=...&type=recovery
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      const queryError =
        url.searchParams.get("error_description") ||
        url.searchParams.get("error");
      const queryErrorCode = url.searchParams.get("error_code");

      // 2) Older flows put tokens in the URL hash (#access_token=...&type=recovery)
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : "";
      const hashParams = new URLSearchParams(hash);
      const hashError =
        hashParams.get("error_description") || hashParams.get("error");
      const hashErrorCode = hashParams.get("error_code");

      if (queryError || hashError) {
        const code = queryErrorCode || hashErrorCode;
        const message = queryError || hashError || "";
        setLinkInvalid(true);
        setError(
          code === "otp_expired" || /expired|invalid/i.test(message)
            ? "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Passwort-Link an."
            : message || "Link ist ungültig oder abgelaufen.",
        );
        window.history.replaceState({}, "", "/reset-password");
        return;
      }

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setReady(true);
          // Clean the URL
          window.history.replaceState({}, "", "/reset-password");
          return;
        }
        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (type as "recovery") || "recovery",
          });
          if (error) throw error;
          setReady(true);
          window.history.replaceState({}, "", "/reset-password");
          return;
        }
      } catch (e: any) {
        setLinkInvalid(true);
        setError(e?.message || "Link ist ungültig oder abgelaufen.");
        return;
      }

      // 3) Fallback: hash-based session (already parsed by supabase-js)
      const { data: sess } = await supabase.auth.getSession();
      if (sess.session) setReady(true);
    })();

    return () => data.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement)
      .value;
    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen haben.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("Passwort konnte nicht gesetzt werden.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Neues Passwort setzen</CardTitle>
          <CardDescription>
            {ready
              ? "Wähle ein neues Passwort für dein Konto."
              : "Link wird geprüft…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">Neues Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                disabled={!ready}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Passwort bestätigen</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                disabled={!ready}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={!ready || loading}
            >
              {loading ? "Wird gespeichert…" : "Passwort speichern"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}