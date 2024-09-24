import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate,   } from "react-router-dom";
import { TextInputLabel } from "@/widgets/textInputs";
import { GoogleButton } from "@/widgets/buttons";
import { useState} from "react";
import { useRegister, useLogin  } from "@/hooks";


export function SignUp() {

  //React hoooks
  const navigate = useNavigate();

  //Custom hook
  const registerMutation = useRegister();
  const login  = useLogin();


  //Info status
  const [error, setError] = useState(null);

  // User States
  const [isFreelancer, setIsFreelancer] = useState(true);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Company States

  const [companyTaxId, setCompanyTaxId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [companyTelephone, setCompanyTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [companyEmail, setCompnayEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Datos básicos de usuario
    const userData = {
      first_name,
      last_name,
      username,
      email,
      phone_number: phone,
      password,
      role: isFreelancer ? "freelancer" : "client",
    };


    const companyData = {
      tax_id: companyTaxId,
      name: companyName,
      country: country,
      city: city,
      address: address,
      telephobe: companyTelephone,
      email: companyEmail,
    };


    try {
      await registerMutation.mutateAsync(
        isFreelancer ? userData : { ...userData, companyData }
      );

      
      await login.mutateAsync({email, password});
      
      // Just navigate if register and login is correct

      navigate("/profile");
    
    } catch (err) {
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message 
      );
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
        <div className="flex flex-col items-center m-4">
          <Typography variant="h2" color="blue" className="font-bold mb-4">
            Join Us Today
          </Typography>
          <Typography variant="h5" color="blue-gray">
            How do you want to register?
          </Typography>
        </div>
        <Tabs value="Freelancer">
          <TabsHeader>
            <Tab
              key={"Freelancer"}
              value={"Freelancer"}
              onClick={() => setIsFreelancer(true)}
            >
              Freelancer
            </Tab>
            <Tab
              key={"Client"}
              value={"Client"}
              onClick={() => setIsFreelancer(false)}
            >
              Client
            </Tab>
          </TabsHeader>
        </Tabs>
        <div className="flex flex-col items-center mt-4">
          <Typography variant="h5" color="blue-gray">
            Fill the following fields to register.
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <TextInputLabel
              label="First name"
              placeholder="First name"
              value={first_name}
              onValueChange={setFirstName}
            />
            <TextInputLabel
              label="Last name"
              placeholder="Last name"
              value={last_name}
              onValueChange={setLastName}
            />
            <TextInputLabel
              label="Username"
              placeholder="Username"
              value={username}
              onValueChange={setUsername}
            />
            <TextInputLabel
              label="Email"
              placeholder="email@example.com"
              value={email}
              onValueChange={setEmail}
            />
            <TextInputLabel
              label="Phone number"
              placeholder="Phone number"
              value={phone}
              onValueChange={setPhone}
            />
            <TextInputLabel
              label="Password"
              placeholder="Password"
              value={password}
              onValueChange={setPassword}
              type="password"
            />
            {!isFreelancer && (
              <>
                <TextInputLabel
                  label="Company tax id"
                  placeholder="Company tax id"
                  value={companyTaxId}
                  onValueChange={setCompanyTaxId}
                />
                <TextInputLabel
                  label="Company name"
                  placeholder="Company name"
                  value={companyName}
                  onValueChange={setCompanyName}
                />
                <TextInputLabel
                  label="City"
                  placeholder="City"
                  value={city}
                  onValueChange={setCity}
                />
                <TextInputLabel
                  label="Country"
                  placeholder="Country"
                  value={country}
                  onValueChange={setCountry}
                />
                <TextInputLabel
                  label="Address"
                  placeholder="Address"
                  value={address}
                  onValueChange={setAddress}
                />
                <TextInputLabel
                  label="Company telephone"
                  placeholder="Company telephone"
                  value={companyTelephone}
                  onValueChange={setCompanyTelephone}
                />
                <TextInputLabel
                  label="Company email"
                  placeholder="Company email"
                  value={companyEmail}
                  onValueChange={setCompnayEmail}
                />
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
          <Button
            className="mt-6"
            fullWidth
            color="blue"
            type="submit"
            disabled={registerMutation.isLoading}
          >
            {registerMutation.isLoading ? "Registering..." : "Register Now"}
          </Button>
          {error && (
            <Typography variant="small" color="red" className="mt-2">
              {error}
            </Typography>
          )}
          <div className="space-y-4 mt-8">
            <GoogleButton />
          </div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
