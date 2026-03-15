import { Link } from '@tanstack/react-router';

const routeLinks = [
  { to: '/', label: '__root__' },
  { to: '/', label: '/' },
  { to: '/captcha', label: '/captcha' },
  { to: '/loading', label: '/loading' },
  { to: '/report', label: '/report' },
  { to: '/scan-history', label: '/scan-history' },
  { to: '/result/critical', label: '/result/critical' },
  { to: '/result/non-url', label: '/result/non-url' },
  { to: '/result/safe', label: '/result/safe' },
  { to: '/result/warning', label: '/result/warning' },
] as const;

export default function HomePage() {
  return (
    <main>
      <nav aria-label="Route list">
        <ul>
          {routeLinks.map(({ to, label }) => (
            <li key={`${label}-${to}`}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
