export default function AuthMessage({ type, message }) {
  if (!message) return null;

  return (
    <div className={`auth-message ${type}`}>
      {message}
    </div>
  );
}
