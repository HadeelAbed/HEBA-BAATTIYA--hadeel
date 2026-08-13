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
import { registerSchema } from "@/lib/validations";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setSubmitting(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitting(false);
      toast.error(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setSubmitting(false);

    if (result?.error) {
      toast.success("Account created — please sign in");
      router.push("/login");
      return;
    }

    toast.success("Account created — welcome to the House");
    const session = await getSession();
    const role = session?.user?.role;
    router.push(role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" : "/");
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
              Create Account
            </h1>
            <p className="mt-2 text-center text-sm text-stone">
              Join the House of Heba Baattiya
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last Name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Phone"
                placeholder="+966 5XX XXX XXX"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <label className="flex items-start gap-2.5 text-xs text-graphite">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded-none border-mist"
                  {...register("agreeToTerms")}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-600">
                  {errors.agreeToTerms.message}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={submitting}
              >
                Create Account
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-stone">
              Already have an account?{" "}
              <Link href="/login" className="text-charcoal underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
