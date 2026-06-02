'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/nav.module.css';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/learning', label: 'Learning' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span>muizzy</span>
          <span>ranking</span>
        </Link>
        <ul className={styles.links}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href || (href !== '/' && pathname.startsWith(href)) ? styles.active : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
