import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
