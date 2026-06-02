import ScrollReveal from '@/components/ScrollReveal';
import styles from '@/styles/learning.module.css';

const reflections = [
  {
    number: '01',
    category: 'Performance',
    title: 'Use the ORM until it gets in the way',
    text: [`SQLAlchemy was fine for normal inserts. It was not fine when I needed to load a large CSV quickly. I moved the import path to asyncpg, used PostgreSQL COPY, staged the rows, then inserted from the temp table.`, `That work taught me where the ORM helps and where it hides too much. I still use it, but I do not force it into jobs the database can handle better.`],
  },
  {
    number: '02',
    category: 'Systems Thinking',
    title: 'Know what the source of truth is',
    text: [`The event store made WAL concepts real for me. The log holds the truth. The in-memory index only makes reads faster. If the index disappears, the app can rebuild it from the log.`, `I now ask that question earlier: what is real, what is derived, and what breaks if the derived layer goes away?`],
  },
  {
    number: '03',
    category: 'Auth & Security',
    title: 'Short token lifetimes expose weak auth',
    text: [`A 3-minute access token forced me to build refresh logic properly. The client had to recover from expiry, the backend had to rotate tokens, and failures had to be clear.`, `That constraint made the auth system better. Long token lifetimes would have hidden the same problems until later.`],
  },
  {
    number: '04',
    category: 'API Design',
    title: 'Make inputs predictable before caching them',
    text: [`Natural language search created a cache problem. Two users could ask the same thing with different words, so raw text made bad cache keys.`, `I fixed it by parsing each query into a standard filter object and building the key from that object. Predictable input came before speed.`],
  },
  {
    number: '05',
    category: 'Developer Experience',
    title: 'A tool starts before the first command',
    text: [`The CLI worked, but that was not enough. I still had to package it, build an install script, handle platforms, and make the first run feel simple.`, `That changed how I think about developer tools. If setup is painful, many users never reach the useful part.`],
  },
  {
    number: '06',
    category: 'Growth',
    title: 'Build before everything feels clear',
    text: [`I like to understand things before I touch them. That helps, but it can also slow me down when the only way to learn is to build.`, `HNG moved fast enough to push me out of that habit. The bugs taught me faster than another pass through the docs would have.`],
  },
];

export default function LearningPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <ScrollReveal>
          <header className={styles.header}>
            <p className={styles.headerLabel}>Learning</p>
            <h1 className={styles.title}>Learning</h1>
            <p className={styles.subtitle}>
              Clear notes from building backend projects under pressure.
            </p>
          </header>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <div className={styles.intro}>
              <div className={styles.introText}>
                <p>HNG moved quickly. It showed me the gap between knowing a concept and using it when the feature has to work.</p>
                <p>These notes cover the lessons that stayed with me after the projects shipped.</p>
              </div>
            </div>
          </ScrollReveal>

          <div className={styles.reflectionList}>
            {reflections.map((r, i) => (
              <ScrollReveal key={r.number} delay={i * 80}>
                <div className={styles.reflection}>
                  <div className={styles.reflectionMeta}>
                    <span className={styles.reflectionNum}>{r.number}</span>
                    <span className={styles.reflectionCategory}>{r.category}</span>
                  </div>
                  <div>
                    <h2 className={styles.reflectionTitle}>{r.title}</h2>
                    <div className={styles.reflectionText}>
                      {r.text.map((para, j) => <p key={j}>{para}</p>)}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className={styles.closing}>
              <p className={styles.quote}>
                I ask why until the system makes sense. Then I build.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
