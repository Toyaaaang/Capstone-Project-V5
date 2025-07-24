import { RegisterForm } from "@/components/forms/auth/register-form"

export default function Page() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative select-none"
      style={{
        backgroundImage: "url('/bg-warehouse.jpg')",
      }}
    >
      <div className=" max-w-2xl p-2 mt-4">
        <RegisterForm />
      </div>
    </div>
  )
}