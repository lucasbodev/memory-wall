import React from 'react';
import styles from '@/app/[locale]/home.module.css';
import { getTranslations } from 'next-intl/server';
import Heading, { HeadingTypes } from '@/components/heading/heading.component';
import Button, { ButtonTypes } from '@/components/button/button.component';
import Image from 'next/image';

const Home = async () => {

  const projectId = '495113449789-umja2354vv77kvrte74chr8gldfomqbc.apps.googleusercontent.com';
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString('utf-8')
  );
  const t = await getTranslations('Home');
  const {Translate} = require('@google-cloud/translate').v2;
  const translate = new Translate({credentials});

  const text = 'Hello, world!';

  // The target language
  const target = 'fr';

  // Translates some text into French
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);


  return (
    <main>
      <div className={styles.onboarding}>
        <Image
          src="/images/logo.svg"
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
