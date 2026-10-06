import { useState } from "react";
import { transferMoney } from "../api/walletApi";

// `onTransferComplete` lets this component tell the Dashboard "a transfer
// just succeeded, here's the new balance and transaction" — the Dashboard
// then updates its own state so the UI refreshes without a page reload.
export default function TransferForm({ onTransferComplete }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await transferMoney(recipient, amount);
      onTransferComplete(result);
      setRecipient("");
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <h2>Send money</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="transfer-row">
          <div className="field">
            <label htmlFor="recipient">Recipient</label>
            <input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Name or UPI ID"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
      <p className="transfer-note">
        In the real PayFlow backend, this hits the transfer endpoint that uses
        PostgreSQL row-level locking to keep concurrent transfers safe.
      </p>
    </div>
  );
}
