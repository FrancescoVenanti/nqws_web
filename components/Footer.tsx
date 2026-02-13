import styles from "./Footer.module.css";
import AppLinks from "./AppLinks";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.text}>
                <img src="/icon.png" alt="nQws" className={styles.icon} />
                <span>&copy; {new Date().getFullYear()} nQws. All rights reserved.</span>
            </div>
            <AppLinks />
        </footer>
    );
}
