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
  }))

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
