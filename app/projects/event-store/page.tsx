import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/deepdive.module.css';

export default function EventStorePage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/projects" className={styles.back}>← Back to projects</Link>

        <ScrollReveal>
          <header className={styles.header}>
            <p className={styles.headerLabel}>Project deep dive</p>
            <h1 className={styles.headerTitle}>Simple Event Store</h1>
            <p className={styles.headerDesc}>
              An append-only HTTP event log with durable writes, byte-offset reads,
              startup recovery, and a small WAL-style storage model.
            </p>
            <div className={styles.headerTags}>
              {['Python','FastAPI','Append-only Log','Binary I/O','Crash Recovery','WAL Concepts','asyncpg'].map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <nav className={styles.toc}>
            <p className={styles.tocTitle}>Contents</p>
            <ul className={styles.tocList}>
              {[['01','Architecture'],['02','What it explores'],['03','Key endpoints'],['04','Technical challenges'],['05','What I learned']].map(([n,l]) => (
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
                <p>Two components: a FastAPI HTTP layer and an <code>EventStore</code> class that owns all file I/O. The store keeps an in-memory index mapping each event ID to a byte offset and length in the log file. Reads seek directly to that position. Writes append to the end and record the position before writing.</p>
              </div>
              <div className={styles.archBox}>
                <pre>{`POST /events                      GET /events/:id
     │                                  │
     ▼                                  ▼
┌─────────────────────────────────────────────────┐
│               FastAPI (main.py)                  │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              EventStore (store.py)               │
│                                                  │
│  _index: dict[id → {offset, length}]  ← O(1)    │
│                        │                         │
│                        │  seek(offset)           │
│                        ▼  read(length)           │
│  ┌───────────────────────────────────────────┐   │
│  │  events.log  (append-only, one JSON/line) │   │
│  │  {"id":"a1b2…","user":"ada","action":…}\n │   │
│  └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘`}</pre>
              </div>
              <div className={styles.body}>
                <p>On startup, the store replays the log file line by line, rebuilding the index from scratch. <strong>The log is the source of truth. The index is a derived acceleration layer.</strong> Crash recovery is just replaying the log.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section} id="section-02">
              <p className={styles.sectionLabel}>02</p>
              <h2 className={styles.sectionTitle}>What it explores</h2>
              <div className={styles.body}>
                <p>This was a learning project, not a production database. I built it to understand what happens when a storage engine strips the problem down to a log file and an index.</p>
                <p>The questions were practical: <strong>why is appending safer than overwriting?</strong> How can a service read directly from a large file? What does crash recovery look like in code?</p>
                <p>The project made those ideas concrete. The code is small, but the tradeoffs are real.</p>
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
                    <tr><th>Method</th><th>Path</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span className={`${styles.method} ${styles.post}`}>POST</span></td><td><span className={styles.path}>/events</span></td><td>Accepts any JSON. Stamps UUID v4 + ISO-8601 timestamp. Returns 201.</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/events/:id</span></td><td>Direct byte-seek read. O(1). Returns 404 if not found.</td></tr>
                    <tr><td><span className={`${styles.method} ${styles.get}`}>GET</span></td><td><span className={styles.path}>/stats</span></td><td>Total event count and log file size in bytes.</td></tr>
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
                    title: 'Getting the byte offset right',
                    body: `The index stores the byte position of each event before writing, not after. The answer was f.tell() — call it immediately before the write, and that number is the offset to store in the index. Simple in hindsight, but it required understanding exactly what tell() returns and when.`,
                    code: { file: 'store.py', content: `# record position BEFORE writing
offset = f.tell()
f.write(line_bytes)
f.flush()
os.fsync(f.fileno())   # durable before index update
self._index[event_id] = {"offset": offset, "length": len(line_bytes)}` }
                  },
                  {
                    title: 'Text mode vs binary mode',
                    body: `Opening in text mode ("a") seemed natural, but text mode can silently transform newline characters — and f.tell() in text mode returns an opaque value that doesn't map to actual byte positions. Switching to binary append mode ("ab") fixed both: offsets became exact byte positions, writes became exact bytes.`,
                  },
                  {
                    title: 'Unicode and the ensure_ascii trap',
                    body: `By default, json.dumps() escapes non-ASCII to \\uXXXX sequences, inflating byte lengths unpredictably and making the log unreadable. Setting ensure_ascii=False lets UTF-8 characters write as-is — correct, readable, predictable byte lengths. The test suite covers Arabic and Japanese payloads.`,
                  },
                  {
                    title: 'Accepting freeform JSON in FastAPI',
                    body: `FastAPI's usual pattern is a typed Pydantic model. When the payload can be anything, that breaks. The clean solution was using request.body() and parsing manually — simpler than annotated dict approaches and more honest about what the endpoint actually does.`,
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
                  ['01', 'Indexing is a tradeoff, not a feature', "The in-memory index makes reads O(1) but costs startup time and memory proportional to log size. Understanding that tradeoff concretely — not abstractly — changed how I think about every caching and indexing decision since."],
                  ['02', 'Append-only is safer because it never destroys existing data', "Overwriting means a partial write corrupts the record permanently. Appending means the worst case is a partial line at the end — everything before it is intact. This is the intuition behind WAL: write intent first, apply second."],
                  ['03', 'Recovery is just replaying the log', "The log is the truth. The index is derived. If you lose the index, you rebuild it. This mental model now applies to every durable system I look at."],
                  ['04', 'File mode details matter more than expected', 'The difference between "a" and "ab" is subtle in documentation and catastrophic in practice if you need exact byte offsets. Low-level I/O rewards careful reading.'],
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
