import { useEffect, useState } from "react";
import { magic } from "../lib/magic";
import { useNavigate } from "react-router-dom";
import * as fcl from "@onflow/fcl";

const Dashboard = () => {
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const [balance, setBalance] = useState();

  const AUTHORIZATION_FUNCTION = magic.flow.authorization;

  const navigate = useNavigate();

  const finishSocialLogin = async () => {
    try {
      const result = await magic.oauth.getRedirectResult();
      setEmail(result.magic.userMetadata.email);
      const address = result.magic.userMetadata.publicAddress;
      setPublicAddress(address);
      setUserName(
        result.oauth.userInfo.name ?? result.oauth.userInfo.preferredUsername
      );
      setUser(result);
      const balance = await getFlowBalance(address);
      setBalance(balance);
      console.log("result : ", result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    finishSocialLogin();
  }, []);

  const logout = async () => {
    try {
      await magic.user.logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getFlowBalance = async (address) => {
    const cadence = `
      import FlowToken from 0x7e60df042a9c0868
      import FungibleToken from 0x9a0766d93b6608b7
  
      pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
  
        let vaultRef = account.getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")
  
        return vaultRef.balance
      }
    `;
    const args = (arg, t) => [arg(address, t.Address)];
    const balance = await fcl.query({ cadence, args });
    console.log({ balance });
    return balance;
  };

  const refreshBalance = async () => {
    const balance = await getFlowBalance(publicAddress);
    setBalance(balance);
    console.log("userBalance", balance);
  };

  return (
    <div className="container">
      {!user && <div className="loading">Loading...</div>}

      {user && (
        // <div>
        //   <h1>Data returned:</h1>
        //   <pre className="user-info">{JSON.stringify(user, null, 3)}</pre>
        // </div>
        <>
          <div className="container">
            <h1>Current user: {userName}</h1>
            <h1>User Email: {email}</h1>
            <h3>User Balance: {balance} Flow</h3>
            <>
              <button onClick={refreshBalance}>Refresh Balance</button>
            </>
            <a
              href="https://testnet-faucet.onflow.org/fund-account"
              target="_blank"
            >
              Get some free tokens
            </a>

            <h1>Flow address </h1>
            <div className="info">
              {" "}
              <a
                href={
                  "https://flow-view-source.com/testnet/account/0xeaddc7d99c13089c" +
                  publicAddress
                }
                target="_blank"
              >
                {publicAddress}{" "}
              </a>
            </div>
          </div>
        </>
      )}

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
