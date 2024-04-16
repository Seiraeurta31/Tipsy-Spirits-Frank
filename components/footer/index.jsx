import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../../03-DB_and_Auth/mongo-auth-example/hooks/useLogout";

export default function Footer(props) {
  return (
    <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
  );
}

