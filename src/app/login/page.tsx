"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validations";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    setSubmitting(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setSubmitting(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome back");
    router.push("/dashboard");
    router.refresh();
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
            <h1 className="text-center font-display text-2xl tracking-wide">
              Welcome Back
            </h1>
            <p className="mt-2 text-center text-sm text-stone">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-stone hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={submitting}
              >
                Sign In
              </Button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-hairline" />
              <span className="text-xs text-stone">OR</span>
              <div className="h-px flex-1 bg-hairline" />
            </div>

            <button className="flex w-full items-center justify-center gap-3 border border-mist py-3 text-sm transition hover:border-charcoal">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.07C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.61H1.27A11.95 11.95 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4-3.07z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.76 0 3.34.61 4.58 1.78l3.42-3.42C17.94 1.18 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.07C6.22 6.83 8.87 4.75 12 4.75z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-stone">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-charcoal underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
