// components/NavBar.js
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav style={{ position: "absolute", top: "20px" }}>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "200px",  // adjust this value as necessary
        }}
      >
        {router.pathname !== "/" && (
          <li>
            <Link href="/" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Home
              </span>
            </Link>
          </li>
        )}
        {router.pathname !== "/about" && (
          <li>
            <Link href="/about" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                About
              </span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
