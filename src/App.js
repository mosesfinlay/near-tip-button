import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TipButton from "./TipButton";
import * as nearAPI from "near-api-js";
const { utils, connect, keyStores, WalletConnection } = nearAPI;

// Connection configuration
const config = {
  testnet: {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  },
  mainnet: {
    networkId: "mainnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  }
};

class App extends Component {
  state = {
    wallet: false,
    accountId: null,
  }

  sendNear = async (amount, receiver) => {
    const { wallet } = this.state;

    // Account sending the Near
    const account = wallet.account();

    // Convert the human readable number of Near we are sending to YoctoNear
    // YoctoNear is the number of indivisible units in one NEAR
    const yoctoNear = utils.format.parseNearAmount(amount);

    // Transfer tokens
    await account.sendMoney(
      receiver, // Receiver account id
      yoctoNear // Amount in yoctoNEAR
    );
  }

  // Initialize connection
  async initNear() {
    const near = await connect(config.testnet);
    const wallet = new WalletConnection(near);

    // If a user is signed in return their account id
    // If a user is not signed in return null
    const accountId = wallet.getAccountId() || null;

    this.setState({
      wallet,
      accountId
    });
  }

  nearLogin = () => {
    const { wallet } = this.state;

    wallet.requestSignIn("example.testnet");
  }

  componentDidMount() {
    this.initNear();
  }

  render() {
    const {
      accountId
    } = this.state;

    return (
      <div className="container pt-5">
        <h1 className="fw-bolder">Near Tip Button</h1>
        <p className="lead mb-5">An example implementation of a tipping feature using Near.</p>

        {accountId ?
          <TipButton
            // Change this to your account id!
            receiver="mosesfinlay.testnet"
            sendNear={this.sendNear}
          />
        :
          <button
            className="btn btn-outline-dark mb-2"
            onClick={this.nearLogin}
          >
            Login with Near
          </button>
        }

        {accountId &&
          <p>Signed in as: {accountId}</p>
        }
      </div>
    );
  }
}

export default App;
