const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/DecoCaake',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8.2h2.1V5H14c-2.4 0-4 1.5-4 4.1V11H7.5v3.2H10V21h3.3v-6.8h2.5l.5-3.2H13.3V9.3c0-.7.3-1.1 1.1-1.1Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/decocake.shop',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.5c-2.3 0-2.6 0-3.5.1-1.7.1-3.1 1.5-3.2 3.2-.1.9-.1 1.2-.1 3.5s0 2.6.1 3.5c.1 1.7 1.5 3.1 3.2 3.2.9.1 1.2.1 3.5.1s2.6 0 3.5-.1c1.7-.1 3.1-1.5 3.2-3.2.1-.9.1-1.2.1-3.5s0-2.6-.1-3.5c-.1-1.7-1.5-3.1-3.2-3.2-.9-.1-1.2-.1-3.5-.1Zm0 1.6c2.3 0 2.5 0 3.4.1 1.2.1 1.8.7 1.9 1.9.1.9.1 1.1.1 3.4s0 2.5-.1 3.4c-.1 1.2-.7 1.8-1.9 1.9-.9.1-1.1.1-3.4.1s-2.5 0-3.4-.1c-1.2-.1-1.8-.7-1.9-1.9-.1-.9-.1-1.1-.1-3.4s0-2.5.1-3.4c.1-1.2.7-1.8 1.9-1.9.9-.1 1.1-.1 3.4-.1Z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@decocakeshop',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.6 8.3a5.7 5.7 0 0 1-3.4-1.1v7.1a5.5 5.5 0 1 1-4.7-5.4v2.5a3 3 0 1 0 2.1 2.9V2.8h2.5a5.7 5.7 0 0 0 3.5 3.3v2.2Z" />
      </svg>
    ),
  },
]

export default function SocialLinks({
  variant = 'footer',
  showLabels = true,
  className = '',
}) {
  return (
    <nav
      className={`social-links social-links--${variant} ${className}`.trim()}
      aria-label="Redes sociales"
    >
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          title={item.name}
        >
          {item.icon}
          {showLabels ? <span>{item.name}</span> : null}
        </a>
      ))}
    </nav>
  )
}
