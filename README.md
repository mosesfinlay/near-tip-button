# How to Add a Tip Button to Your Near Dapp
### This tutorial will show you how to add tipping functionality to your Near Dapp.

All the source code for this tutorial can be found on Github: [https://github.com/mosesfinlay/near-tip-button](https://github.com/mosesfinlay/near-tip-button)

Check out the quick reference for NEAR-API-JS: [https://docs.near.org/docs/api/naj-quick-reference](https://docs.near.org/docs/api/naj-quick-reference)

![](https://cdn-images-1.medium.com/max/2400/1*arFPwoZMXUV32M_taLj2iQ.gif)

## The setup

In this tutorial, we will use Near’s JavaScript Library (near-api-js) to build the tip button functionality and Create React App (create-react-app) to initialize our project.

For the purposes of this tutorial, we will be using Near’s testnet. Testnet is great for experimentation and there is no risk involved because the funds have no real value.

Run the following commands to get started with this tutorial.

```
$ npx create-react-app near-tip-button && cd near-tip-button

$ npm i near-api-js react-bootstrap bootstrap

$ npm start
```

## Login using Near

We need to add a way for our dapp to request authorization from our users. The login process creates an access key that will be stored in the browser’s local storage and is what we need to sign transactions. This will give our dapp permission to request the transfer of Near tokens to someone else's wallet.

Before we can add the login code, we need to modify our App.js file to establish a connection with Near. This connection is what allows us to request to log in with Near. We’ll put the connection code inside the initNear method on our App component.

```javascript
// ...
// Import library
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

    // Check if a user is signed in
    const accountId = wallet.getAccountId() || null;

    this.setState({ wallet, accountId });
    console.log(near, this.state);
  }

  componentDidMount() {
    this.initNear();
  }

// ...
```

If you open the dev console in your browser, you’ll see that we’ve established a connection with Near!

Next, we can add the nearLogin method to our App.

```javascript
// ...
nearLogin = () => {
  const { wallet } = this.state;
  wallet.requestSignIn("example.testnet");
}

componentDidMount() {
  this.initNear();
}

// ...
```

In the render method, we’ll add a button that calls the nearLogin method when it’s clicked.

```jsx
render() {
  const { accountId } = this.state;

  return (
    <div className="App">
      <header>
        <h1>Near Tip Button</h1>

        <button onClick={this.nearLogin}>Login with Near</button>
        {accountId && <p>Signed in as: {accountId}</p>}
      </header>
    </div>
  );
}
```

Back in the browser, we should have a functioning login button!

![](https://cdn-images-1.medium.com/max/2400/1*8nLJVrnMfklccLOscEtsGw.gif)

## Update design

Let’s update the design using Bootstrap. In the App.js file, remove the CSS import statement and replace it with Bootstrap CSS.

```javascript
i̶m̶p̶o̶r̶t̶ ̶"̶.̶/̶A̶p̶p̶.̶c̶s̶s̶"̶
import "bootstrap/dist/css/bootstrap.min.css";
```

Update the code inside the App component render method.
```jsx
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
```

## The tip button

Now can add the tipping functionality. We’ll create a new method called sendNear. This method will take two parameters, the number of Near tokens to send and the account id receiving the tip. In the sendNear method, we’ll convert the amount of human-readable Near tokens we are sending, to YoctoNear. YoctoNear is the number of indivisible units in one Near. Finally, at the end of the function, we’ll call the sendMoney method on the account object. We’re able to call this function because of the access key created when the user logged in with their Near wallet.

```javascript
// ...
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

// ...
```

Next, we need a way to call the sendNear method. Create a new file called TipButton.js alongside the App.js file. In our new file, we’ll create a TipButton component and include a modal where the user can select the amount of Near they would like to send. We can pass the sendNear method and the receiver account id to the TipButton component via props.

```jsx
// TipButton.js
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

class TipButton extends Component {
  state = {
    modalOpen: false,
    amount: "0"
  }

  // Open and close the modal
  toggleModal = () => this.setState(state => ({
    modalOpen: !state.modalOpen
  }));

  // Update the amount of Near to send
  updateAmount = amount => this.setState({ amount: amount.toString() });

  render() {
    const {
      receiver,
      sendNear
    } = this.props;

    const {
      amount,
      modalOpen
    } = this.state;

    return (
      <>
        <button
          className="btn btn-outline-primary mb-3"
          onClick={this.toggleModal}
        >
          Ⓝ Tip Near
        </button>

        <Modal
          size="md"
          centered
          show={modalOpen}
          onHide={this.toggleModal}
        >
          <Modal.Header className="d-flex">
            <h5 className="mb-0">
              Tip: <span className="fw-bolder">{receiver}</span>
            </h5>

            <button className="bg-white border-0 text-muted" onClick={this.toggleModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </Modal.Header>

          <Modal.Body>
            <p className="mb-4">Select the amount of Ⓝ to send.</p>

            {/* Select how much Near to send */}
            <button onClick={() => this.updateAmount(1)} className="btn bg-white rounded-circle border-primary text-primary" style={{ width: "60px", height: "60px" }}>
              Ⓝ 1
            </button>
            <button onClick={() => this.updateAmount(3)} className="btn bg-white rounded-circle border-primary text-primary ms-3" style={{ width: "60px", height: "60px" }}>
              Ⓝ 3
            </button>
            <button onClick={() => this.updateAmount(5)} className="btn bg-white rounded-circle border-primary text-primary ms-3" style={{ width: "60px", height: "60px" }}>
              Ⓝ 5
            </button>

            {/* Call the sendNear method */}
            <button
              onClick={() => sendNear(amount, receiver)}
              disabled={amount === "0"}
              className="btn btn-primary mt-5 d-block fw-bold w-100"
            >
              Send Ⓝ {amount}
            </button>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default TipButton;
```

## Last step

All that’s left is to render the tip button! Back in App.js, import the TipButton component at the top of the file like so.

```javascript
// App.js
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import TipButton from "./TipButton";

import * as nearAPI from "near-api-js";
const { utils, connect, keyStores, WalletConnection } = nearAPI;

// ...
```

Then update the render method on the App component to include the TipButton component. Make sure to replace **_YOUR_ACCOUNT_ID_** with the account id receiving the tip. We’ll also add a small link at the bottom for users to sign out.

```jsx
// App.js
<div className="container pt-5">
  <h1 className="fw-bolder">Near Tip Button</h1>
  <p className="lead mb-5">An example implementation of a tipping feature using Near.</p>

  {accountId ?
    <TipButton
      **_// Change this to your account id!_**  receiver=**"_YOUR_ACCOUNT_ID_**.testnet**"**
      sendNear={this.sendNear}
    />
  :
    <button
      className="btn btn-outline-dark mb-3"
      onClick={this.nearLogin}
    >
      Login with Near
    </button>
  }

  {accountId &&
    <>
      <p className="mb-0">Signed in as: {accountId}</p>

      {/* Clickable link for user's to sign out */}
      <a href="/" className="fw-light"
        onClick={() => this.state.wallet.signOut()}
      >
       Sign out
      </a>
    </>
  }
</div>
```

Open up the browser and try it out! After you send some Near, go to your testnet wallet [https://wallet.testnet.near.org/](https://wallet.testnet.near.org/) to see the transaction succeeded.

![](https://cdn-images-1.medium.com/max/2400/1*arFPwoZMXUV32M_taLj2iQ.gif)

Congrats! By this point, the tipping feature is pretty much complete! I hope you learned a thing or two about Near and Near’s JavaScript Library. Feel free to mess around with it a little more and let me know your thoughts.

----------

_Thanks for reading! If you liked this article, consider giving me a follow on_ [_Twitter_](https://twitter.com/mosesfinlay) _or subscribing to my_ [_Blog_](https://www.moses.dev/newsletter)_._
