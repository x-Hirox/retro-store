export interface BoardRow {
  _id?: string;
  userId: string;
  username: string;
  avatar: string;
  highScore: number;
  highestLevel: number;
}

export default function Leaderboard({
  rows,
  me,
}: {
  rows: BoardRow[];
  me?: string;
}) {
  return (
    <section className="mg-lead">
      <h3>Top Retro Gamers</h3>
      {!rows.length && <p className="mg-muted">ჯერ არავის დაუწერია რეკორდი — იყავი პირველი.</p>}
      <ol>
        {rows.map((row, i) => (
          <li key={row.userId || i} className={String(row.userId) === me ? "me" : ""}>
            <span className="rank">{i + 1}</span>
            <span className="av">{row.avatar || row.username.slice(0, 1)}</span>
            <span className="name">{row.username}</span>
            <span className="lvl">Lv {row.highestLevel}</span>
            <span className="pts">{row.highScore.toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
