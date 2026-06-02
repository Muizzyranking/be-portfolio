import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/deepdive.module.css';

export default function InsightaPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/projects" className={styles.back}>← Back to projects</Link>

        <ScrollReveal>
          <header className={styles.header}>
            <p className={styles.headerLabel}>Project deep dive</p>
            <h1 className={styles.headerTitle}>Insighta Labs+</h1>
            <p className={styles.headerDesc}>
              A demographic intelligence backend with natural language querying, GitHub OAuth,
              role-based access, and fast bulk CSV ingestion.
            </p>
            <div className={styles.headerTags}>
              {['Python','FastAPI','PostgreSQL','asyncpg','JWT','GitHub OAuth','PKCE','Rate Limiting','CSV Bulk Import','Caching'].map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <nav className={styles.toc}>
            <p className={styles.tocTitle}>Contents</p>
            <ul className={styles.tocList}>
              {[['01','Architecture'],['02','Problem it solved'],['03','Key endpoints'],['04','Technical challenges'],['05','What I learned']].map(([n,l]) => (
                <li key={n}>
                  <a href={`#section-${n}`}>
                    <span className={styles.tocNum}>{n}</span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollReveal>

        <div className={styles.content}>

          <ScrollReveal>
            <div className={styles.section} id="section-01">
              <p className={styles.sectionLabel}>01</p>
              <h2 className={styles.sectionTitle}>Architecture</h2>
              <div className={styles.body}>
                <p>The backend uses a layered structure. Routers handle HTTP, services own business logic, and shared utilities sit in core modules. The main tables are <strong>profiles</strong>, <strong>users</strong>, and <strong>refresh_tokens</strong>.</p>
              </div>
              <div className={styles.archBox}>
                <pre>{`insighta-backend/
├── app/
│   ├── routers/       # HTTP route handlers only
│   ├── services/      # Business logic (profiles, github, APIs)
│   ├── core/          # Shared utilities (tokens, users, countries)
│   ├── middleware/    # Logging, rate limiting
│   ├── dependencies/  # FastAPI dependency injection
│   └── models.py      # SQLAlchemy ORM models
├── scripts/           # Admin promotion
└── tests/`}</pre>
              </div>
              <div className={styles.body}>
                <p>Authentication supports two clients: a cookie-based web portal and a PKCE CLI flow. Both use the same GitHub OAuth backend. The web portal receives HTTP-only cookies. The CLI writes tokens to <code>~/.insighta/credentials.json</code>.</p>
                <p>Access tokens expire in <strong>3 minutes</strong>, and refresh tokens expire in <strong>5 minutes</strong>. That short window forced single-use rotation and clear refresh handling.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section} id="section-02">
              <p className={styles.sectionLabel}>02</p>
              <h2 className={styles.sectionTitle}>Problem it solved</h2>
              <div className={styles.body}>
                <p>The platform started as a stateless name inference wrapper. A user sent a name and received gender, age, and nationality estimates from third-party APIs.</p>
                <p>The larger problem was search. Analysts needed to query a demographic dataset without writing SQL. I built a <strong>rule-based natural language parser</strong> that maps plain English to structured filters.</p>
                <p>Admins needed to upload and manage the dataset at scale. Analysts needed fast, reliable read access with exportable results. Both needed to work from a web portal and a CLI, sharing the same backend.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section} id="section-03">
              <p className={styles.sectionLabel}>03</p>
              <h2 className={styles.sectionTitle}>Key endpoints</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Method</th><th>Path</th><th>Access</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/auth/github</span></td><td>Public</td><td>OAuth initiation, supports PKCE for CLI</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/api/profiles</span></td><td>Any</td><td>Paginated profile list</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/api/profiles/search</span></td><td>Any</td><td>Natural language → structured filters</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/api/profiles/export</span></td><td>Any</td><td>Stream query results as CSV</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.post}`}>POST</span></td><td><span className={styles.path}>/api/profiles</span></td><td>Admin</td><td>Bulk CSV upload — up to 500k rows</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.delete}`}>DELETE</span></td><td><span className={styles.path}>/api/profiles/:id</span></td><td>Admin</td><td>Remove a profile</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.patch}`}>PATCH</span></td><td><span className={styles.path}>/api/admin/users/:id/promote</span></td><td>Admin</td><td>Elevate analyst to admin</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section} id="section-04">
              <p className={styles.sectionLabel}>04</p>
              <h2 className={styles.sectionTitle}>Technical challenges</h2>
              <div className={styles.challengeList}>
                {[
                  {
                    title: '500k rows in under 40 seconds',
                    body: `SQLAlchemy ORM inserts, even batched, couldn't touch the required throughput. The fix was bypassing the ORM entirely — using PostgreSQL's native COPY protocol via asyncpg. A temporary staging table receives the validated records, then a single INSERT...SELECT...ON CONFLICT DO NOTHING moves everything to the main table and deduplicates in one pass. Same mechanism database tools use for bulk loading.`,
                    code: {
                      file: 'bulk_import.py',
                      content: `await raw_conn.copy_records_to_table(
    "profiles_import",
    records=valid_rows,
    columns=COPY_COLUMNS,
)
result = await raw_conn.execute("""
    INSERT INTO profiles (...)
    SELECT ... FROM profiles_import
    ON CONFLICT (name) DO NOTHING
""")`
                    }
                  },
                  {
                    title: 'Cache keys from non-deterministic natural language',
                    body: `"young males from Nigeria" and "males from nigeria who are young" are the same query but produce different cache keys if you key on raw input. The fix: parse to a canonical filter struct first, sort it, serialise that as the key. Cache keys are derived from structured output, not raw text. Hit rate became meaningful.`,
                  },
                  {
                    title: 'Dual-client auth without duplicating logic',
                    body: `A CLI and web portal sharing the same OAuth backend present a routing problem. The solution was PKCE — the CLI sends a code_challenge and redirect_uri in the initial request. The backend detects the CLI redirect and routes tokens as query params to the CLI's local server instead of setting cookies. One auth system, two clients, clean separation.`,
                  },
                  {
                    title: 'Compiling and distributing the CLI',
                    body: `Users needed installation without knowing Python. The answer was a shell download script — one curl | bash command that fetches the right PyInstaller binary for the platform, places it in PATH, and sets up the credentials directory. Building and distributing compiled Python tools exposed a lot of platform-specific edge cases I hadn't considered.`,
                  },
                  {
                    title: 'Country name matching without false positives',
                    body: `"niger" appears inside "nigeria". The parser uses a longest-match strategy — all country names sorted by length, longest first, stopping at the first match. "nigeria" always wins when both are candidates. Simple, but the bug it prevents would have been invisible in testing.`,
                  },
                ].map((c) => (
                  <div key={c.title} className={styles.challengeItem}>
                    <p className={styles.challengeTitle}>{c.title}</p>
                    <p className={styles.challengeBody}>{c.body}</p>
                    {c.code && (
                      <div className={styles.codeBlock} style={{marginTop:'14px'}}>
                        <div className={styles.codeHeader}>
                          <span className={styles.codeDot}/>
                          <span className={styles.codeDot}/>
                          <span className={styles.codeDot}/>
                          <span className={styles.codeFilename}>{c.code.file}</span>
                        </div>
                        <div className={styles.codeBody}>
                          <code>{c.code.content}</code>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section} id="section-05">
              <p className={styles.sectionLabel}>05</p>
              <h2 className={styles.sectionTitle}>What I learned</h2>
              <div className={styles.learningList}>
                {[
                  ['01', 'PostgreSQL is a data engine, not just a store', 'Using COPY and staging tables made it clear how much power lives inside Postgres that most application-layer code never touches. Thinking about the database as a participant in computation, not just a persistence layer, changed how I approach performance problems.'],
                  ['02', 'Caching requires determinism before speed', 'A fast cache with unpredictable keys is just complexity. Normalising inputs before they become cache keys is the prerequisite that makes everything else work.'],
                  ['03', 'Auth is a surface area, not a feature', 'Short-lived tokens force you to build rotation, revocation, and retry logic properly. The 3/5 minute window was inconvenient at first — and exactly right as a learning constraint.'],
                  ['04', 'Distribution is part of the product', 'Writing the download script and compiling the CLI into a binary made it clear: how users get your software is as important as what the software does. A tool nobody can install isn\'t a tool.'],
                ].map(([n, title, body]) => (
                  <div key={n} className={styles.learningItem}>
                    <span className={styles.learningNum}>{n}</span>
                    <div className={styles.learningBody}>
                      <strong>{title}</strong>
                      {body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
