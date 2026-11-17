import {
  PIPELINE,
  statusLabel,
  STATUS_COLOR,
} from "../utils/orderStatus";

export default function OrderTracker({ status }: { status?: string }) {
  if (status === "Cancelled") {
    return (
      <div className="order-tracker cancelled">
        <span>შეკვეთა გაუქმდა</span>
      </div>
    );
  }

  const current = PIPELINE.indexOf(
    (status as (typeof PIPELINE)[number]) || "Pending",
  );
  const idx = current < 0 ? 0 : current;

  return (
    <ol className="order-tracker">
      {PIPELINE.map((step, i) => (
        <li
          key={step}
          className={i < idx ? "done" : i === idx ? "current" : "todo"}
          style={
            i <= idx
              ? { ["--step" as string]: STATUS_COLOR[step] }
              : undefined
          }
        >
          <i />
          <span>{statusLabel(step)}</span>
        </li>
      ))}
    </ol>
  );
}
