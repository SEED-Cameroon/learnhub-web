export default function MaterialIcon({ name, className = '', fill = false, ariaHidden = true }) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  )
}
