function formatAmount(amount) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
  return amount > 0 ? `+${formatted}` : `-${formatted}`;
}

export default function TransactionList({ transactions }) {
  if (!transactions.length) {
    return <p className="empty-state">No transactions yet.</p>;
  }

  return (
    <ul className="tx-list">
      {/* `key` must be unique and stable per item — React uses it to
          track which list item is which across re-renders, instead of
          re-rendering the whole list from scratch every time. */}
      {transactions.map((tx) => (
        <li className="tx-row" key={tx.id}>
          <div className="tx-meta">
            <span className="tx-label">{tx.label}</span>
            <span className="tx-time">{tx.time}</span>
          </div>
          <span className={`tx-amount ${tx.type}`}>{formatAmount(tx.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
