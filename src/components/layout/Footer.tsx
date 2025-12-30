import Link from 'next/link';

const footerLinks = [
  { name: 'Studio', href: '/' },
  { name: 'Experiments', href: '/experiments' },
  { name: 'Collection', href: '/collection' },
  { name: 'Media', href: '/media' },
  { name: 'Contact', href: '/contact' },
];

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/sabrinachandini' },
  { name: 'Twitter', href: 'https://twitter.com/sabrinachandini' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Brand */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="accent-square" />
              <span className="font-semibold">Sabrina Chandini</span>
            </div>
            <p className="text-sm text-[var(--color-fg-muted)] max-w-xs">
              Builder, storyteller, entrepreneur. Always learning new AI tools.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-6 md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-6 md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@sabrinachandini.com"
                  className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
          <p className="text-xs text-[var(--color-fg-subtle)]">
            &copy; {currentYear} Sabrina Chandini. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[var(--color-secondary)]" />
            <span className="w-2 h-2 bg-[var(--color-accent)]" />
            <span className="w-2 h-2 bg-[var(--color-border-strong)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
