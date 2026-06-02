import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/contact.module.css';

const links = [
  { platform: 'Email', name: 'muiz@example.com', href: 'mailto:muiz@example.com' },
  { platform: 'GitHub', name: 'github.com/muizzyranking', href: 'https://github.com/muizzyranking' },
  { platform: 'Twitter / X', name: '@muizzyranking', href: 'https://twitter.com/muizzyranking' },
  { platform: 'LinkedIn', name: 'linkedin.com/in/muizzyranking', href: 'https://linkedin.com/in/muizzyranking' },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <ScrollReveal>
          <header className={styles.header}>
            <p className={styles.headerLabel}>Get in touch</p>
            <h1 className={styles.title}>Contact</h1>
            <p className={styles.subtitle}>
              Send a clear note about backend roles, systems work, or AI tooling. I read context
              and reply directly.
            </p>
          </header>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <div className={styles.linkList}>
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  className={styles.linkItem}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                >
                  <span className={styles.linkPlatform}>{link.platform}</span>
                  <span className={styles.linkName}>{link.name}</span>
                  <div className={styles.linkIcon}>↗</div>
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className={styles.availSection}>
              <p className={styles.availLabel}>Current status</p>
              <div className={styles.availGrid}>
                <div className={styles.availCard}>
                  <p className={styles.availCardLabel}>Status</p>
                  <p className={`${styles.availCardValue} ${styles.open}`}>Open to work</p>
                </div>
                <div className={styles.availCard}>
                  <p className={styles.availCardLabel}>Location</p>
                  <p className={styles.availCardValue}>Nigeria</p>
                </div>
                <div className={styles.availCard}>
                  <p className={styles.availCardLabel}>Timezone</p>
                  <p className={styles.availCardValue}>WAT (UTC+1)</p>
                </div>
              </div>
              <p className={styles.note}>
                I am interested in backend engineering, data-heavy systems, and practical AI/ML
                tooling. Email is the best way to reach me.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
