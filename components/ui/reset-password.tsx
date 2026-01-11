import { cn } from "@/lib/utils"
import logo from "@/assets/images/rewire-logo-conquer.png"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { useAuth } from "../../auth/Authprovider";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Password reset link sent. Check your email.")
    } catch (err: any) {
      let msg = "Something went wrong. Please try again."

      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email."
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email address."
      }

      setError(msg)
    } finally {
      setLoading(false)
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

          <CardTitle className="text-2xl font-semibold text-green-700">
          Forgot Password
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Enter your email and we’ll send you a reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <FieldGroup className="gap-5">
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

            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              onClick={onSubmit}
              disabled={loading || !email}
              className="
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
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-green-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
