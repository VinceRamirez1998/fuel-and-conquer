import { cn } from "@/lib/utils"
import logo from "@/assets/images/rewire-logo-conquer.png"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
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
import { useSearchParams, Link, useNavigate, useParams } from "react-router-dom"
import { confirmPasswordReset } from "firebase/auth"
import { useAuth } from "../../auth/Authprovider"
import { auth } from "@/config/firebase"

export function ResetPasswordConfirm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { code } = useParams();
  const navigate = useNavigate()
  const { user } = useAuth()


  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async () => {
    console.log(code);
    if (!code) {
      setError("Invalid or expired reset link.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await confirmPasswordReset(auth, code, password)
      setSuccess(true)

      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 2000)
    } catch (err: any) {
      let msg = "Something went wrong. Please try again."

      if (err.code === "auth/expired-action-code") {
        msg = "This reset link has expired."
      } else if (err.code === "auth/invalid-action-code") {
        msg = "Invalid reset link."
      } else if (err.code === "auth/weak-password") {
        msg = "Password is too weak."
      }

      console.log("Error:", err);

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

          <CardTitle className="text-2xl font-semibold text-green-700 py-6">
            Reset Password
          </CardTitle>

          {/* <CardDescription className="text-sm text-muted-foreground">
            Enter your new password below
          </CardDescription> */}
        </CardHeader>

        <CardContent className="pb-8">
          <FieldGroup className="gap-5">
            {/* New Password */}
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
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

            {/* Confirm Password */}
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </Field>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 text-center">
                Password updated successfully. Redirecting…
              </p>
            )}

            <Button
              onClick={onSubmit}
              disabled={loading}
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
              {loading ? "Updating..." : "Update"}
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
