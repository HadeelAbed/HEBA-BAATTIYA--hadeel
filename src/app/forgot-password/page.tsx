"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSent(true);
      setDevLink(body.devLink ?? null);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <Navbar />
      <main className="pt-[88px]">
        <div className="container-site flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex justify-center">
              <Logo variant="monogram" className="h-14 w-auto" />
            </div>

            {sent ? (
              <div className="text-center">
                <h1 className="font-display text-2xl tracking-wide">Check your email</h1>
                <p className="mt-3 text-sm leading-relaxed text-stone">
                  If an account exists for that address, we&apos;ve sent you a reset
                  link. It&apos;s valid for 1 hour.
                </p>
                {devLink && (
                  <div className="mt-5 rounded border border-mist bg-[#fafaf8] p-4 text-left">
                    <p className="text-xs font-medium text-charcoal">
                      No SMTP configured yet — use this link:
                    </p>
                    <a href={devLink} className="mt-1 block break-all text-xs text-charcoal underline">
                      {devLink}
                    </a>
                  </div>
                )}
                <div className="mt-8">
                  <Link href="/login" className="text-sm text-charcoal underline">
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-center font-display text-2xl tracking-wide">
                  Forgot password
                </h1>
                <p className="mt-2 text-center text-sm text-stone">
                  Enter your email and we&apos;ll send you a reset link.
                </p>

                {error && (
                  <p className="mt-4 rounded border border-[#e7c9c4] bg-[#fdf5f3] px-3 py-2 text-sm text-[#a13c2c]">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
                    Send reset link
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-stone">
                  Remembered it?{" "}
                  <Link href="/login" className="text-charcoal underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
