import { cn } from "@/lib/utils"
import logo from "@/assets/images/rewire-logo-conquer.png";
import { useState } from "react";
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
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/Authprovider";
import { login } from "@/api/v1/v1"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loginUser } =  useAuth();
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      await login(email, password)
      await loginUser({email, password})
      console.log(email, password)
      navigate("/dashboard",  {replace:true})
    } catch (err) {
      let message = "An error occurred. Please try again.";
      if (err.code) {
        switch (err.code) {
          case "auth/invalid-email":
            message = "Invalid email address.";
            break;
          case "auth/user-disabled":
            message = "This account has been disabled.";
            break;
          case "auth/user-not-found":
            message = "Invalid credentials. Please try again.";
            break;
          case "auth/wrong-password":
          case "auth/invalid-credential":
            message = "Invalid credentials. Please try again.";
            break;
          case "auth/too-many-requests":
            message = "Too many login attempts. Please try again later.";
            break;
        }
      }

      console.error(message);
    }
  };

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
          <CardTitle className="text-2xl font-semibold tracking-tight text-green-700">
            Login
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Sign in to continue to your account
          </CardDescription>
       </CardHeader>


        <CardContent className="pb-8">
          <form>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="
                    rounded-lg
                    border-gray-300
                    focus:border-green-500
                    focus:ring-green-500
                  "
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                  className="
                    rounded-lg
                    border-gray-300
                    focus:border-green-500
                    focus:ring-green-500
                  "
                />
              </Field>

              <Field>
                <Button
                  onClick ={onSubmit}
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


