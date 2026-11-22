function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" aria-hidden="true">
      <text
        x="0"
        y="13"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="14"
        fontStyle="italic"
        fontWeight="800"
        fill="#1a1f71"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 36 22" aria-hidden="true">
      <circle cx="13" cy="11" r="9" fill="#eb001b" />
      <circle cx="23" cy="11" r="9" fill="#f79e1b" />
      <path
        d="M18 4.4a9 9 0 0 1 0 13.2 9 9 0 0 1 0-13.2z"
        fill="#ff5f00"
      />
    </svg>
  );
}

function ApplePayMark() {
  return (
    <svg viewBox="0 0 62 22" aria-hidden="true">
      <path
        fill="#111"
        d="M10.2 6.3c.6-.8 1.1-1.8 1-2.9-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.8 1.1.1 2.1-.6 2.8-1.4zm.3 1.3c-1.5-.1-2.8.9-3.5.9-.8 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.8-2.4c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.3-3.5 0-2.2 1.8-3.2 1.9-3.3-1.1-1.6-2.7-1.8-3.5-1.8z"
      />
      <text
        x="20"
        y="16"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="700"
        fill="#111"
      >
        Pay
      </text>
    </svg>
  );
}

function GPayMark() {
  return (
    <svg viewBox="0 0 52 22" aria-hidden="true">
      <text x="0" y="16" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700">
        <tspan fill="#4285f4">G</tspan>
        <tspan fill="#111"> Pay</tspan>
      </text>
    </svg>
  );
}

function WordMark({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <svg viewBox="0 0 46 22" aria-hidden="true">
      <text
        x="23"
        y="16"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="12"
        fontWeight="800"
        fill={color}
      >
        {label}
      </text>
    </svg>
  );
}

const MARKS = [
  { id: "visa", label: "Visa", node: <VisaMark /> },
  { id: "mc", label: "Mastercard", node: <MastercardMark /> },
  { id: "apple", label: "Apple Pay", node: <ApplePayMark /> },
  { id: "gpay", label: "Google Pay", node: <GPayMark /> },
  { id: "tbc", label: "TBC", node: <WordMark label="TBC" color="#00a3e0" /> },
  { id: "bog", label: "BOG", node: <WordMark label="BOG" color="#f58220" /> },
];

export default function PaymentMarks() {
  return (
    <div className="pay-marks" aria-label="გადახდის მეთოდები">
      {MARKS.map((mark) => (
        <span key={mark.id} className={`pay-logo ${mark.id}`} title={mark.label}>
          {mark.node}
        </span>
      ))}
    </div>
  );
}
