type ScanResultCardProps = {
  description: string;
  hints: string[];
  state: 'idle' | 'safe' | 'warning';
  title: string;
};

const STATE_LABEL = {
  idle: 'Preview',
  safe: 'Check Ready',
  warning: 'Watch Out',
} as const;

export default function ScanResultCard({ description, hints, state, title }: ScanResultCardProps) {
  return (
    <article className={`result-card result-card--${state}`}>
      <span className="result-card__eyebrow">{STATE_LABEL[state]}</span>
      <h3 className="result-card__title">{title}</h3>
      <p className="result-card__description">{description}</p>

      <ul className="result-card__hints">
        {hints.map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </ul>
    </article>
  );
}
