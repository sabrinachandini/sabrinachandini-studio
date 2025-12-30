import { Mail, Linkedin, Twitter } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for collaborations, speaking, or project ideas.',
};

const contactReasons = [
  {
    title: 'Collaborations',
    description: 'Building something and think we might work well together.',
  },
  {
    title: 'Speaking',
    description: 'Interested in having me speak at your event or podcast.',
  },
  {
    title: 'Project ideas',
    description: 'Have an idea you want to explore or get feedback on.',
  },
];

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:hello@sabrinachandini.com',
    icon: Mail,
    label: 'hello@sabrinachandini.com',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/sabrinachandini',
    icon: Linkedin,
    label: 'linkedin.com/in/sabrinachandini',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/sabrinachandini',
    icon: Twitter,
    label: '@sabrinachandini',
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="accent-square" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Contact
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Let's talk
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)]">
            I'm always interested in new ideas, collaborations, and conversations. Email is the best way to reach me.
          </p>
        </div>

        {/* Reasons to write */}
        <section className="mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-6">
            Reasons to get in touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactReasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-white border border-[var(--color-border)] rounded p-5"
              >
                <h3 className="font-semibold mb-2">{reason.title}</h3>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact methods */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-6">
            Find me here
          </h2>
          <div className="space-y-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-4 p-4 bg-white border border-[var(--color-border)] rounded hover:border-[var(--color-border-strong)] transition-colors group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[var(--color-bg-alt)] rounded group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="font-medium">{link.name}</div>
                    <div className="text-sm text-[var(--color-fg-muted)]">
                      {link.label}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Email CTA */}
        <section className="mt-16 bg-[var(--color-bg-alt)] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to reach out?</h2>
          <p className="text-[var(--color-fg-muted)] mb-6">
            The best way to start a conversation is a simple email.
          </p>
          <a
            href="mailto:hello@sabrinachandini.com"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Mail size={16} />
            Send an email
          </a>
        </section>
      </div>
    </div>
  );
}
