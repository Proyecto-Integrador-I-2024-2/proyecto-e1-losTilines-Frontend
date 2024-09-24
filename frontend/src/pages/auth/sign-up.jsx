import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { TextInputLabel } from "@/widgets/textInputs";
import { GoogleButton } from "@/widgets/buttons"
import { useState } from "react";


export function SignUp() {
  const [isFreelancer, setIsFreelancer] = useState(false)
  const [isWorker, setIsWorker] = useState(true)

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
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6" >

            {isFreelancer ?
              <>
                <TextInputLabel label="First name" placeholder="First name" />
                <TextInputLabel label="Last name" placeholder="Last name" />
                <TextInputLabel label="Username" placeholder="Username" />
                <TextInputLabel label="Email" placeholder="email@example.com" />
                <TextInputLabel label="Phone number" placeholder="Phone number" />
              </>
              :
              <>
                <TextInputLabel label="Company tax id" placeholder="Company tax id" />
                <TextInputLabel label="Company name" placeholder="Company name" />
                <TextInputLabel label="City" placeholder="City" />
                <TextInputLabel label="Address" placeholder="Address" />
                <TextInputLabel label="Company telephone" placeholder="Company telephone" />
                {isWorker && <TextInputLabel label="Company Dynamic Code" placeholder="Company Dynamic Code" />}
              </>
            }
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
          <Button className="mt-6" fullWidth color="blue">
            Register Now
          </Button>

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
