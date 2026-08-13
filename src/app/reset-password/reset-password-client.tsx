"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [done, setDone] = useState(false);
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
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

            {done ? (
              <div className="text-center">
                <h1 className="font-display text-2xl tracking-wide">Password updated</h1>
                <p className="mt-3 text-sm text-stone">
                  Your password has been changed. You can now sign in.
                </p>
                <div className="mt-8">
                  <Button variant="primary" size="lg" className="w-full" onClick={() => router.push("/login")}>
                    Go to sign in
                  </Button>
                </div>
              </div>
            ) : !token ? (
              <div className="text-center">
                <h1 className="font-display text-2xl tracking-wide">Invalid link</h1>
                <p className="mt-3 text-sm text-stone">
                  This reset link is missing. Please request a new one.
                </p>
                <div className="mt-8">
                  <Link href="/forgot-password" className="text-sm text-charcoal underline">
                    Request a new link
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-center font-display text-2xl tracking-wide">
                  Set a new password
                </h1>
                <p className="mt-2 text-center text-sm text-stone">
                  Choose a new password for your account.
                </p>

                {error && (
                  <p className="mt-4 rounded border border-[#e7c9c4] bg-[#fdf5f3] px-3 py-2 text-sm text-[#a13c2c]">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  <Input
                    label="New password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <Input
                    label="Confirm password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
                    Update password
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-stone">
                  <Link href="/login" className="text-charcoal underline">
                    Back to sign in
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
