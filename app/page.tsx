import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroEyebrow}>
              <span className={styles.dot} />
              Open to work
            </div>
            <h1 className={styles.heroName}>
              <span>Muiz</span>
              <span>Oyebowale</span>
            </h1>
            <div className={styles.heroCopy}>
              <p className={styles.heroTagline}>
                I build backend systems that stay clear, fast, and dependable. My work sits around APIs,
                auth, data pipelines, and the AI tools that need strong engineering behind them.
              </p>
              <div className={styles.heroCta}>
                <Link href="/projects" className={styles.btnPrimary}>
                  View projects
                </Link>
                <Link href="/contact" className={styles.btnSecondary}>
                  Contact me
                </Link>
              </div>
            </div>

            <div className={styles.heroSystem} aria-hidden="true">
              <div className={styles.systemHeader}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.systemFlow}>
                {['API', 'Auth', 'Data', 'AI'].map((item, index) => (
                  <div key={item} className={styles.systemNode}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className={styles.systemLines}>
                <span />
                <span />
                <span />
              </div>
              <p>FastAPI service layer</p>
              <p>PostgreSQL bulk import</p>
              <p>Token rotation and RBAC</p>
              <p>LLM-ready workflows</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <ScrollReveal>
            <p className={styles.sectionLabel}>About</p>
            <h2 className={styles.sectionTitle}>I care about the parts that make software hold up.</h2>
          </ScrollReveal>
          <div className={styles.aboutGrid}>
            <ScrollReveal delay={100}>
              <div className={styles.aboutLeft}>
                <p>
                  Backend work fits how I think. I like tracing how data moves, where errors hide,
                  and what a service does when real traffic puts pressure on it.
                </p>
                <p>
                  I started with C, then moved into Python and TypeScript. That path taught me
                  to respect the basics before reaching for bigger abstractions.
                </p>
                <p>
                  Right now I am learning AI and ML through backend problems: data ingestion,
                  LLM APIs, retrieval flows, and deployment paths that can survive production.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className={styles.aboutRight}>
                {[
                  { label: 'Stack', value: 'Python · TypeScript · FastAPI' },
                  { label: 'Data', value: 'PostgreSQL · SQLite · asyncpg' },
                  { label: 'Learning', value: 'LLMs · MLOps · Rust' },
                  { label: 'Focus', value: 'Backend systems and AI tools' },
                  { label: 'Location', value: 'Nigeria' },
                  { label: 'Availability', value: 'Open to work' },
                ].map(item => (
                  <div key={item.label} className={styles.aboutCard}>
                    <span className={styles.aboutCardLabel}>{item.label}</span>
                    <span className={styles.aboutCardValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className={styles.skillsBg}>
        <div className={styles.skillsInner}>
          <div className="container">
            <ScrollReveal>
              <p className={styles.sectionLabel}>Skills</p>
              <h2 className={styles.sectionTitle}>Tools I use to ship backend work</h2>
            </ScrollReveal>
            <div className={styles.skillsGrid}>
              {[
                {
                  marker: 'API',
                  title: 'Backend services',
                  skills: ['FastAPI and Python', 'REST API design', 'JWT and OAuth2', 'Rate limiting', 'Background tasks'],
                },
                {
                  marker: 'DB',
                  title: 'Data and storage',
                  skills: ['PostgreSQL and SQLite', 'Bulk data ingestion', 'Query optimisation', 'Caching strategies', 'Append-only logs'],
                },
                {
                  marker: 'AI',
                  title: 'Tooling and AI',
                  skills: ['Docker and CI/CD', 'CLI tooling in Python', 'PKCE auth flows', 'LLM API integration', 'RAG architecture'],
                },
              ].map((group, i) => (
                <ScrollReveal key={group.title} delay={i * 100}>
                  <div className={styles.skillGroup}>
                    <div className={styles.skillGroupIcon}>{group.marker}</div>
                    <p className={styles.skillGroupTitle}>{group.title}</p>
                    <ul className={styles.skillList}>
                      {group.skills.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <ScrollReveal>
            <p className={styles.sectionLabel}>Work</p>
            <h2 className={styles.sectionTitle}>Selected projects</h2>
          </ScrollReveal>
          <div className={styles.projectsList}>
            {[
              {
                num: '01',
                slug: 'insighta',
                name: 'Insighta Labs+',
                desc: 'A demographic intelligence backend with natural language search, GitHub OAuth, RBAC, and high-volume CSV ingestion.',
                tags: ['Python', 'FastAPI', 'PostgreSQL', 'asyncpg', 'JWT', 'PKCE'],
              },
              {
                num: '02',
                slug: 'event-store',
                name: 'Simple Event Store',
                desc: 'An append-only HTTP event log with direct byte-offset reads, startup recovery, and a clear WAL-style source of truth.',
                tags: ['Python', 'FastAPI', 'Binary I/O', 'WAL Concepts'],
              },
            ].map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 100}>
                <Link href={`/projects/${p.slug}`} className={styles.projectItem}>
                  <div>
                    <p className={styles.projectNum}>{p.num}</p>
                    <p className={styles.projectName}>{p.name}</p>
                    <p className={styles.projectDesc}>{p.desc}</p>
                    <div className={styles.projectTags}>
                      {p.tags.map(t => <span key={t} className={styles.projectTag}>{t}</span>)}
                    </div>
                  </div>
                  <div className={styles.projectArrow}>↗</div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link href="/projects" className={styles.viewAllLink}>
              All projects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
