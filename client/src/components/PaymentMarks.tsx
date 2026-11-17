export default function PaymentMarks() {
  return (
    <div className="pay-marks" aria-label="გადახდის მეთოდები">
      <span className="pay-chip visa">VISA</span>
      <span className="pay-chip mc">Mastercard</span>
      <span className="pay-chip apple"> Apple Pay</span>
      <span className="pay-chip gpay">G Pay</span>
      <span className="pay-chip tbc">TBC</span>
      <span className="pay-chip bog">BOG</span>
    </div>
  );
}
