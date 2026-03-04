export default function Logo({size=72}:{size?:number}) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 100 120" aria-label="hap’n logo">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B10100"/>
          <stop offset="100%" stopColor="#AF1C1C"/>
        </linearGradient>
      </defs>
      <path d="M20 20 C20 10, 40 10, 40 20 L40 55 C40 60, 48 60, 50 55 L58 35 C60 30, 70 30, 72 35 C73 40, 67 50, 64 58 C60 68, 50 80, 42 82 C32 85, 20 78, 20 68 Z" fill="url(#g)" />
      <circle cx="65" cy="100" r="9" fill="url(#g)" />
    </svg>
  )
}
