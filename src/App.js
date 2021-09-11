import React, { Component } from "react";
import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection } = nearAPI;

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

  nearLogout = () => {
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

        <button
          className="btn btn-outline-dark mb-2"
          onClick={this.nearLogin}
        >
          Login with Near
        </button>

        {accountId &&
          <p>Signed in as: {accountId}</p>
        }
      </div>
    );
  }
}

export default App;
