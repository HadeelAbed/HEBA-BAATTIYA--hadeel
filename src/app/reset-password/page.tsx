import { Suspense } from "react";
import { ResetPasswordClient } from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="pt-[88px]" />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
