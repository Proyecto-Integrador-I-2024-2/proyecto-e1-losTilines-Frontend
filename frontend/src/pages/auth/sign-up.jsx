import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { TextInputLabel } from "@/widgets/textInputs";
import { GoogleButton } from "@/widgets/buttons";
import { useState } from "react";
import { useRegister } from "../../hooks/useRegister"; 

export function SignUp() {
  const [isFreelancer, setIsFreelancer] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const registerMutation = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      lastName,
      username,
      email,
      phone,
      role: isFreelancer ? "freelancer" : "worker", // Agrega el rol según el tipo de usuario
    };

    try {
      await registerMutation.mutateAsync(userData);
    
    } catch (err) {
      setError("Registration failed! Please check your input.");
    }
  };

  return (
    <section className="p-8 flex w-full h-full">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" color="blue" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill the following fields to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            {isFreelancer ? (
              <>
                <TextInputLabel label="First name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <TextInputLabel label="Last name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <TextInputLabel label="Username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextInputLabel label="Email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextInputLabel label="Phone number" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </>
            ) : (
              <>
                {/* Campos para trabajador */}
              </>
            )}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth color="blue" type="submit" disabled={registerMutation.isLoading}>
            {registerMutation.isLoading ? "Registering..." : "Register Now"}
          </Button>
          {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
          <div className="space-y-4 mt-8">
            <GoogleButton />
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
