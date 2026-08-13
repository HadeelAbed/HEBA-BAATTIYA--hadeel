"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
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
    const session = await getSession();
    const role = session?.user?.role;
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      const cb = new URLSearchParams(window.location.search).get("callbackUrl");
      router.push(cb && cb.startsWith("/") ? cb : "/");
    }
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
