import { LoginForm } from "@/components/forms/auth/login-form"

export default function Page() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative select-none"
      style={{
        backgroundImage: "url('/bg-warehouse.jpg')",
      }}
    >
      <div
        className="w-full max-w-sm"
      >
        <LoginForm />
      </div>
    </div>
  )
}