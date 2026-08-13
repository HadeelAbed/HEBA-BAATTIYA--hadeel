"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/validations";

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit() {
    setSubmitting(true);
    // In production: POST /api/contact -> creates a ContactMessage row via Prisma
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    reset();
    toast.success("Message sent — we&apos;ll respond within 24 hours");
  }

  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mb-14 text-center">
          <p className="eyebrow">We&apos;d Love to Hear From You</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide">Contact</h1>
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_420px]">
          <div>
            <h2 className="mb-6 font-display text-xl tracking-wide">
              Send a Message
            </h2>
            {submitted ? (
              <div className="border border-hairline bg-bone p-8 text-center">
                <p className="font-display text-lg">
                  Thank you for reaching out
                </p>
                <p className="mt-2 text-sm text-stone">
                  A member of our team will respond within 24 hours.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input label="Subject (optional)" {...register("subject")} />
                <Textarea
                  label="Message"
                  rows={6}
                  error={errors.message?.message}
                  {...register("message")}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div className="border border-hairline p-7">
              <h2 className="mb-5 font-display text-xl tracking-wide">
                Visit the Atelier
              </h2>
              <div className="space-y-5 text-sm text-graphite">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    strokeWidth={1.4}
                    className="mt-0.5 flex-shrink-0 text-stone"
                  />
                  <span>
                    Tahlia Street, Al Hamra District, Jeddah, Saudi Arabia
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone
                    size={17}
                    strokeWidth={1.4}
                    className="mt-0.5 flex-shrink-0 text-stone"
                  />
                  <span>+966 12 345 6789</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail
                    size={17}
                    strokeWidth={1.4}
                    className="mt-0.5 flex-shrink-0 text-stone"
                  />
                  <span>concierge@hebabaattiya.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock
                    size={17}
                    strokeWidth={1.4}
                    className="mt-0.5 flex-shrink-0 text-stone"
                  />
                  <span>
                    Sat–Thu, 10:00 AM – 8:00 PM. By appointment for bridal
                    consultations.
                  </span>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden bg-bone">
              <iframe
                title="Atelier location map"
                className="h-full w-full border-0"
                loading="lazy"
                src="https://www.google.com/maps?q=Jeddah,Saudi+Arabia&output=embed"
              />
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
