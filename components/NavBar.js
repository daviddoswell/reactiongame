// components/NavBar.js
import React from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function NavBar() {
  const router = useRouter();

  return (
    <nav style={{ position: 'absolute', top: '20px', right: '100px' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {router.pathname !== '/' &&
          <li style={{ display: 'inline', marginRight: '100px' }}>
            <Link href="/" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>Home</span>
            </Link>
          </li>
        }
        {router.pathname !== '/about' &&
          <li style={{ display: 'inline', marginRight: '100px' }}>
            <Link href="/about" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>About</span>
            </Link>
          </li>
        }
      </ul>
    </nav>
  );
}
