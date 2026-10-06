// A small "presentational" component: it just receives data via props
// and renders it. It holds no state of its own — the Dashboard fetches
// the balance and passes it down. Keeping components like this (dumb,
// reusable, easy to test) is a core idea interviewers will probe on.
export default function Balance({ amount, loading }) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount ?? 0);

  return (
    <div className="balance-card">
      <p className="balance-eyebrow">Available balance</p>
      <p className="balance-figure">{loading ? "..." : formatted}</p>
      <p className="balance-sub">Updated just now</p>
    </div>
  );
}
