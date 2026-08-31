import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-fk py-24 flex flex-col items-center text-center">
      <p className="font-display text-7xl text-gold mb-4">404</p>
      <h1 className="font-display text-2xl text-charcoal mb-2">Page Not Found</h1>
      <p className="text-stone text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
