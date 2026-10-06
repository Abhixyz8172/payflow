import { useEffect, useState } from "react";
import { getBalance, getTransactions } from "../api/walletApi";
import Balance from "./Balance";
import TransferForm from "./TransferForm";
import TransactionList from "./TransactionList";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect with an empty dependency array ([]) runs once, right after
  // the component first renders — the standard pattern for "fetch data
  // when this screen loads".
  useEffect(() => {
    async function loadData() {
      const [balanceData, txData] = await Promise.all([getBalance(), getTransactions()]);
      setBalance(balanceData);
      setTransactions(txData);
      setLoading(false);
    }
    loadData();
  }, []);

  function handleTransferComplete({ balance: newBalance, transaction }) {
    setBalance(newBalance);
    setTransactions((prev) => [transaction, ...prev]);
  }

  return (
    <div className="dashboard">
      <Balance amount={balance} loading={loading} />
      <TransferForm onTransferComplete={handleTransferComplete} />
      <div className="panel">
        <h2>Recent transactions</h2>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
