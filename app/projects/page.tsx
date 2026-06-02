import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/projects.module.css';

const projects = [
  {
    number: '01',
    slug: 'insighta',
    name: 'Insighta Labs+',
    description: 'A demographic intelligence backend with name inference, natural language search, GitHub OAuth, role-based access, and fast CSV ingestion.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'asyncpg', 'JWT', 'OAuth2', 'PKCE', 'Rate Limiting'],
  },
  {
    number: '02',
    slug: 'event-store',
    name: 'Simple Event Store',
    description: 'An append-only HTTP event log with durable writes, byte-offset reads, startup recovery, and a simple WAL-style storage model.',
    tags: ['Python', 'FastAPI', 'Append-only Log', 'Binary I/O', 'Crash Recovery', 'WAL Concepts'],
  },
];

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <ScrollReveal>
          <header className={styles.header}>
            <p className={styles.headerLabel}>Work</p>
            <h1 className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>
              Backend projects that pushed me to learn through real constraints, not just notes.
            </p>
          </header>
        </ScrollReveal>

        <div className={styles.list}>
          {projects.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 120}>
              <Link href={`/projects/${p.slug}`} className={styles.item}>
                <span className={styles.itemNumber}>{p.number}</span>
                <div className={styles.itemBody}>
                  <p className={styles.itemName}>{p.name}</p>
                  <p className={styles.itemDesc}>{p.description}</p>
                  <div className={styles.itemTags}>
                    {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.itemArrow}>↗</div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
