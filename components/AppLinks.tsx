import styles from "./AppLinks.module.css";

export default function AppLinks() {
    return (
        <div className={styles.container}>
            <a href="#" className={styles.storeLink} target="_blank" rel="noopener noreferrer">
                App Store
            </a>
            <a href="#" className={styles.storeLink} target="_blank" rel="noopener noreferrer">
                Google Play
            </a>
        </div>
    );
}
