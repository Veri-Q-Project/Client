type PlaceholderPageProps = {
  description: string;
  title: string;
};

export default function PlaceholderPage({ description, title }: PlaceholderPageProps) {
  return (
    <main className="placeholder-page">
      <section className="placeholder-page__body">
        <span className="placeholder-page__badge">Route Placeholder</span>
        <h1 className="placeholder-page__title">{title}</h1>
        <p className="placeholder-page__description">{description}</p>
      </section>
    </main>
  );
}
