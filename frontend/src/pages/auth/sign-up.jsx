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
import { Link, useNavigate, } from "react-router-dom";
import { TextInputLabel } from "@/widgets/textInputs";
import { GoogleButton } from "@/widgets/buttons";
import { useState } from "react";
import apiClient from "@/services/apiClient";


export function SignUp() {

  //React hoooks
  const navigate = useNavigate();


  //Info status
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);

  // User States
  const [isFreelancer, setIsFreelancer] = useState(true);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Company States

  const [companyTaxId, setCompanyTaxId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [companyTelephone, setCompanyTelephone] = useState("");
  const [country, setCountry] = useState("");
  const [companyEmail, setCompnayEmail] = useState("");


  //API call
  const [isLoading, setIsLoading] = useState(false);



  async function postUser() {

    var url = ""
    if (isFreelancer) {
      url = "freelancers"
    } else {
      url = "business-managers"
    }

    const body = {
      "email": email,
      "password": password,
      "first_name": first_name,
      "last_name": last_name,
      "phone_number": phone
    }
    try {
      const { data, status } = await apiClient.post(`/${url}/`, body)

      if (status === 201) {
        console.log("User created successfully");
        if (!isFreelancer) {
          postCompany(data.id)
        } else {
          setIsLoading(false);
          navigate("/auth/sign-in")
        }
      }

    } catch (error) {
      console.error("Error creating user: ", error);
    }

  }


  async function postCompany(userId) {

    const body = {
      "tax_id": companyTaxId,
      "name": companyName,
      "address": address,
      "telephone": companyTelephone,
      "email": companyEmail,
      "user": userId
    }

    try {
      const { data, status } = await apiClient.post("/companies/", body)
      if (status === 201) {
        console.log("Company created successfully");
        setIsLoading(false);
        navigate("/auth/sign-in");
      }

    } catch (error) {
      console.error("Error creating company: ", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await postUser();

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
              id="freelancerTab"
              key={"Freelancer"}
              value={"Freelancer"}
              onClick={() => setIsFreelancer(true)}
            >
              Freelancer
            </Tab>
            <Tab
              id="clientTab"
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
              id="firstName"
              label="First name"
              placeholder="First name"
              value={first_name}
              onValueChange={setFirstName}
            />
            <TextInputLabel
              id="lastName"
              label="Last name"
              placeholder="Last name"
              value={last_name}
              onValueChange={setLastName}
            />
            <TextInputLabel
              id="email"
              label="Email"
              placeholder="email@example.com"
              value={email}
              onValueChange={setEmail}
            />
            <TextInputLabel
              id="phoneNumber"
              label="Phone number"
              placeholder="Phone number"
              value={phone}
              onValueChange={setPhone}
            />
            <TextInputLabel
              id="password"
              label="Password"
              placeholder="Password"
              value={password}
              onValueChange={setPassword}
              type="password"
            />
            {!isFreelancer && (
              <>
                <TextInputLabel
                  id="taxId"
                  label="Company tax id"
                  placeholder="Company tax id"
                  value={companyTaxId}
                  onValueChange={setCompanyTaxId}
                />
                <TextInputLabel
                  id="companyName"
                  label="Company name"
                  placeholder="Company name"
                  value={companyName}
                  onValueChange={setCompanyName}
                />
                <TextInputLabel
                  id="city"
                  label="City"
                  placeholder="City"
                  value={city}
                  onValueChange={setCity}
                />
                <TextInputLabel
                  id="country"
                  label="Country"
                  placeholder="Country"
                  value={country}
                  onValueChange={setCountry}
                />
                <TextInputLabel
                  id="address"
                  label="Address"
                  placeholder="Address"
                  value={address}
                  onValueChange={setAddress}
                />
                <TextInputLabel
                  id="companyTelephone"
                  label="Company telephone"
                  placeholder="Company telephone"
                  value={companyTelephone}
                  onValueChange={setCompanyTelephone}
                />
                <TextInputLabel
                  id="companyEmail"
                  label="Company email"
                  placeholder="Company email"
                  value={companyEmail}
                  onValueChange={setCompnayEmail}
                />
              </>
            )}
          </div>
          <Checkbox
            id="checkbox"
            value={checked}
            onClick={() => { setChecked(check => !check); }}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <p
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </p>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button
            id="registerButton"
            className="mt-6"
            fullWidth
            color="blue"
            type="submit"
            disabled={isLoading || !checked}
          >
            {isLoading ? "Registering..." : "Register Now"}
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
