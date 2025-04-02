import React from 'react';
import styles from '@/app/[locale]/home.module.css';
import { getTranslations } from 'next-intl/server';
import Heading, { HeadingTypes } from '@/components/heading/heading.component';
import Button, { ButtonTypes } from '@/components/button/button.component';
import Image from 'next/image';

const Home = async () => {

  const t = await getTranslations('Home');

  return (
    <main>
      <div className={styles.onboarding}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={116}
          height={109}
          className={styles.logo}
          priority
        />
        <div className={styles.onboardingSection}>
          <Heading type={HeadingTypes.H1} text="MEMORY WALL" />
          <p className={`${styles.text} ${styles.subtitle}`}>Mur en mémoire des soldats de la deuxième guerre mondiale.</p>
        </div>
        <div className={styles.onboardingSection}>
          <p className={`${styles.text} ${styles.onboardingText}`}>
            Venez découvrir les héros :
          </p>
          <Button type={ButtonTypes.PRIMARY} text={'Découvrir'} href="/soldiers"/>
        </div>
      </div>
    </main>
  );
};

export default Home;
