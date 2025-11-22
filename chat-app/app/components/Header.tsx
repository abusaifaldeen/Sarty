
"use client";
import styles from './Header.module.css';

const MicSlot = ({ isMuted = false }: { isMuted?: boolean }) => {
  return <div className={styles.micSlot}>{isMuted ? '🔇' : '🎤'}</div>;
};

export default function Header() {
  return (
    <header>
      <div className={styles.adBanner}>
        This is a small ad banner.
      </div>
      <div className={styles.micsContainer}>
        <MicSlot isMuted={true} />
        <MicSlot />
        <MicSlot />
        <MicSlot />
        <MicSlot />
      </div>
    </header>
  );
}
