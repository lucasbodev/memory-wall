import Image from "next/image"
import Link from "next/link"
import styles from "@/app/[locale]/soldier/[id]/soldier.module.css"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import Icon, { IconSizes } from "@/components/icon/icon.component"
import Bulleted from "@/components/bulleted/bulleted.component"
import BulletedList from "@/components/bulleted-list/bulleted-list.component"

const Soldier = ({ params }: { params: Promise<{ id: string }> }) => {

    return (
        <div className={styles.container}>
            {/* Hero image */}
            <div className={styles.hero}>
                <Image
                    src="/images/soldier.png"
                    alt="Soldiers in rain"
                    fill
                    className={styles.image}
                    priority
                />
                <div className={styles.soldierInfo}>
                    <Heading type={HeadingTypes.H1} text="WALTER WHITE" />
                    <div className={styles.rank}>
                        <span>SERGENT</span>
                        <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                        <span>2ÈME DIVISION BLINDÉE</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className={styles.main}>
                {/* Grid container for responsive layout */}
                <div className={styles.gridContainer}>
                    {/* Personal details */}
                    <div className={styles.gridItem}>
                        <div className={styles.personalDetails}>
                            <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                                <span>Né le 15 Mars 1920</span>
                            </Bulleted>
                            <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                                <span>Décédé le 8 Mai 1995</span>
                            </Bulleted>
                            <Bulleted startIcon="/icons/location.svg" iconSize={IconSizes.MEDIUM}>
                                <span>Né à Denver, Colorado</span>
                            </Bulleted>
                            <Bulleted startIcon="/icons/flag.svg" iconSize={IconSizes.MEDIUM}>
                                <span>Service : 1939 - 1945</span>
                            </Bulleted>
                        </div>
                    </div>

                    {/* Decorations */}
                    <div className={styles.gridItem}>
                        <div className={styles.decorationsBox}>
                            <Heading type={HeadingTypes.H2} text="Décorations" startIcon="/icons/medal.svg" />
                            <div className={styles.decorationList}>
                                <BulletedList icon="/icons/star.svg" bullets={
                                    [
                                        "Croix de guerre",
                                        "Médaille de la résistance",
                                        "Légion d'honneur"
                                    ]
                                } />
                            </div>
                        </div>
                    </div>

                    {/* Biography */}
                    <div className={styles.gridItem}>
                        <div className={styles.section}>
                            <Heading type={HeadingTypes.H2} text="Biographie" startIcon="/icons/book.svg" />
                            <div className={styles.sectionContent}>
                                <p>
                                    Walter White s&apos;est engagé dans l&apos;armée française au début de la Seconde Guerre mondiale.
                                    Après la défaite de 1940, il a rejoint les Forces Françaises Libres en Angleterre. Il a participé au
                                    débarquement de Normandie et à la libération de Paris sous le commandement du Général Leclerc. Après
                                    la guerre, il est retourné à la vie civile et a travaillé comme instituteur.
                                </p>
                                <blockquote className={styles.quote}>
                                    <Icon src="/icons/quote.svg" size={IconSizes.SMALLER} />
                                    <p>Le courage n&apos;est pas l&apos;absence de peur, mais la capacité de vaincre ce qui fait peur.</p>
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Military campaigns */}
                    <div className={styles.gridItem}>
                        <div className={styles.section}>
                            <Heading type={HeadingTypes.H2} text="Campagnes militaires" />
                            <div className={styles.sectionContent}>
                                <BulletedList icon="/icons/star.svg" bullets={
                                    [
                                        "Campagne de France",
                                        "Libération de Paris",
                                        "Campagne d&apos;Allemagne"
                                    ]
                                } />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historical documents - full width on all screens */}
                <div className={styles.fullWidth}>
                    <div className={styles.section}>
                        <Heading type={HeadingTypes.H2} text="Documents historiques" />
                        {/* <h3 className={styles.documentsTitle}>Documents historiques</h3> */}
                        <div className={styles.documentsList}>
                            <div className={styles.documentItem}>
                                <div className={styles.documentImage}>
                                    <Image
                                        src="/images/uniforms.png"
                                        alt="Soldiers in uniform"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                                <p className={styles.documentCaption}>En uniforme, 1943</p>
                            </div>
                            <div className={styles.documentItem}>
                                <div className={styles.documentImage}>
                                    <Image
                                        src="/images/orders.png"
                                        alt="Mission briefing"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                                <p className={styles.documentCaption}>Ordre de mission, 1944</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2025 Mur de mémoire des Combattants</p>
                <p className={styles.footerSubtext}>
                    Cette application permet de découvrir l&apos;histoire des soldats à travers des QR codes placés sur leurs
                    photos.
                </p>
            </footer>
        </div>
    )
}

export default Soldier;