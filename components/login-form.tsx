import { cn } from "@/lib/utils"
import logo from "@/assets/images/rewire-logo-conquer.png"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/Authprovider"
import { login } from "@/api/v1/v1"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async () => {
    try {
      await login(email, password)
      await loginUser({ email, password })
      navigate("/dashboard", { replace: true })
    } catch (err: any) {
      let message = "An error occurred. Please try again."

      if (err.code) {
        switch (err.code) {
          case "auth/invalid-email":
            message = "Invalid email address."
            break
          case "auth/user-disabled":
            message = "This account has been disabled."
            break
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            message = "Invalid credentials. Please try again."
            break
          case "auth/too-many-requests":
            message = "Too many login attempts. Please try again later."
            break
        }
      }

      console.error(message)
    }
  }

  return (
    <div
      className={cn(
        "max-w-md mx-auto mt-56 flex flex-col gap-6 px-4",
        className
      )}
      {...props}
    >
      <Card className="border border-green-100 shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-4 pt-8">
          <img
            src={logo}
            alt="Rewire Logo"
            className="mx-auto h-14 w-auto object-contain rounded-lg"
          />
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <FieldGroup className="gap-5">
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </Field>

            {/* Password with Eye Toggle */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="yourpassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {/* Forgot password */}
            <Field>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>
            </Field>

            {/* Login button */}
            <Field>
              <Button
                onClick={onSubmit}
                type="button"
                className="
                  mt-2
                  h-11
                  w-full
                  rounded-lg
                  bg-green-600
                  text-white
                  font-medium
                  hover:bg-green-700
                  focus:ring-2
                  focus:ring-green-500
                  focus:ring-offset-2
                  transition-all
                "
              >
                Login
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
