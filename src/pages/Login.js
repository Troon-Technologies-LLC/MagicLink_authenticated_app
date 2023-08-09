import { magic } from "../lib/magic";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaDiscord } from "react-icons/fa";



const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: new URL("/dashboard", window.location.origin).href,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await magic.oauth.loginWithRedirect({
        provider: "facebook",
        redirectURI: new URL("/dashboard", window.location.origin).href,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await magic.oauth.loginWithRedirect({
        provider: "discord",
        redirectURI: new URL("/dashboard", window.location.origin).href,
      });
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="container">
      <h1>Magic Auth Example with Social Logins +  Flow Blockchain </h1>

      <button onClick={handleGoogleLogin}>
        <FcGoogle size={"2.5rem"} />
        Log in with Google
      </button>

      <button onClick={handleFacebookLogin}>
        <FaFacebook size={"2.5rem"} />
        Log in with Facebook
      </button>

      <button onClick={handleDiscordLogin}>
        <FaDiscord size={"2.5rem"} />
        Log in with Discord
      </button>

    </div>
  );
};

export default Login;
