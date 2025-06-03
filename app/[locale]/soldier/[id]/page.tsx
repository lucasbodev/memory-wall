import Image from "next/image"
import styles from "@/app/[locale]/soldier/[id]/soldier.module.css"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import Icon, { IconSizes } from "@/components/icon/icon.component"
import Bulleted from "@/components/bulleted/bulleted.component"
import BulletedList from "@/components/bulleted-list/bulleted-list.component"
import { getSoldier } from "@/actions/soldier-actions"
import { getTranslations, getLocale } from "next-intl/server"
import { PhotoType } from "@prisma/client"

const Soldier = async ({ params }: { params: Promise<{ id: string }> }) => {

    const t = await getTranslations('Soldier');
    const { id } = await params;
    const soldier = await getSoldier(id);
    const currentLocale = await getLocale();

    if (currentLocale !== 'fr') {
        soldier.rank!.name = soldier.rank?.translations.filter((t) => t.language === currentLocale)[0].name!;
        soldier.unit!.name = soldier.unit?.translations.filter((t) => t.language === currentLocale)[0].name!;
        soldier.birthplace = soldier.translations.filter((t) => t.fieldName === 'birthplace' && t.language === currentLocale)[0].value;
        soldier.biography = soldier.translations.filter((t) => t.fieldName === 'biography' && t.language === currentLocale)[0].value;
        soldier.quote = soldier.translations.filter((t) => t.fieldName === 'quote' && t.language === currentLocale)[0]?.value;
        soldier.campaigns = soldier.campaigns.map((campaign) => ({
            ...campaign,
            campaign: {
                ...campaign.campaign,
                name: campaign.campaign.translations.filter((t) => t.language === currentLocale)[0].name
            }
        }));
        soldier.medals = soldier.medals.map((medal) => ({
            ...medal,
            medal: {
                ...medal.medal,
                name: medal.medal.translations.filter((t) => t.language === currentLocale)[0].name
            }
        }));
        soldier.photos = [
            soldier.photos.filter((photo) => photo.type === PhotoType.MAIN)[0],
            ...soldier.photos.filter((photo) => photo.type === PhotoType.DOCUMENT).map((photo) => ({
                ...photo,
                caption: photo.caption = photo.translations.filter((t) => t.language === currentLocale)[0].caption
            }))
        ]
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.hero} ${styles.mobile}`}>
                <Image
                    src={soldier.photos.filter((photo) => photo.type === PhotoType.MAIN)[0].url}
                    alt="Hero image"
                    fill
                    className={styles.image}
                    priority
                />
                <div className={`${styles.soldierInfo}`}>
                    <Heading type={HeadingTypes.H1} text={soldier.name} />
                    <div className={styles.rank}>
                        <span>{soldier.rank?.name}</span>
                        <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                        <span>{soldier.unit?.name}</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className={styles.gridContainer}>
                {/* Grid container for responsive layout */}
                <div className={`${styles.gridItem} ${styles.desktop}`}>
                    <Image
                        src={soldier.photos.filter((photo) => photo.type === PhotoType.MAIN)[0].url}
                        alt="Hero image"
                        width={1080}
                        height={900}
                        className={styles.image}
                        priority
                    />
                </div>

                {/* Personal details */}
                <div className={styles.gridItem}>
                    <div className={`${styles.soldierInfo} ${styles.desktop}`}>
                        <Heading type={HeadingTypes.H1} text={soldier.name} />
                        <div className={styles.rank}>
                            <span>{soldier.rank?.name}</span>
                            <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                            <span>{soldier.unit?.name}</span>
                        </div>
                    </div>
                    <div className={styles.personalDetails}>
                        <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                            <span>{t('born', { date: soldier.born.toISOString().split('T')[0] })}</span>
                        </Bulleted>
                        {
                            soldier.died &&
                            <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                                <span>{t('died', { date: soldier.died.toISOString().split('T')[0] })}</span>
                            </Bulleted>
                        }
                        <Bulleted startIcon="/icons/location.svg" iconSize={IconSizes.MEDIUM}>
                            <span>{t('birthplace', { birthplace: soldier.birthplace })}</span>
                        </Bulleted>
                        <Bulleted startIcon="/icons/flag.svg" iconSize={IconSizes.MEDIUM}>
                            <span>{t('service', { serviceStart: soldier.serviceStart, serviceEnd: soldier.serviceEnd })}</span>
                        </Bulleted>
                    </div>
                    {
                        soldier.medals.length ?
                            <div className={`${styles.gridItem} ${styles.desktop}`}>
                                <div className={styles.decorationsBox}>
                                    <Heading type={HeadingTypes.H2} text={t('medals')} startIcon="/icons/medal.svg" />
                                    <div className={styles.decorationList}>
                                        <BulletedList
                                            icon="/icons/star.svg"
                                            bullets={
                                                soldier.medals.map((medal) => medal.medal.name)
                                            }
                                            lineHeight={"1.5rem"}
                                        />
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        soldier.campaigns.length ?
                            <div className={`${styles.gridItem} ${styles.desktop}`}>
                                <div className={styles.section}>
                                    <Heading type={HeadingTypes.H2} text={t('campaigns')} />
                                    <div className={styles.sectionContent}>
                                        <BulletedList icon="/icons/star.svg" bullets={
                                            soldier.campaigns.map((campaign) => campaign.campaign.name)
                                        } />
                                    </div>
                                </div>
                            </div> : null
                    }
                </div>

                {/* Decorations */}
                {
                    soldier.medals.length ?
                        <div className={`${styles.gridItem} ${styles.mobile}`}>
                            <div className={styles.decorationsBox}>
                                <Heading type={HeadingTypes.H2} text={t('medals')} startIcon="/icons/medal.svg" />
                                <div className={styles.decorationList}>
                                    <BulletedList
                                        icon="/icons/star.svg"
                                        bullets={
                                            soldier.medals.map((medal) => medal.medal.name)
                                        }
                                        lineHeight={"1.5rem"}
                                    />
                                </div>
                            </div>
                        </div> : null
                }

                {/* Biography */}
                <div className={`${styles.gridItem} ${styles.fullWidth}`}>
                    <div className={styles.section}>
                        <Heading type={HeadingTypes.H2} text={t('biography')} startIcon="/icons/book.svg" />
                        <div className={styles.sectionContent}>
                            <p className={styles.biography}>{soldier.biography}</p>
                            {
                                soldier.quote ?
                                    <blockquote className={styles.quote}>
                                        <Icon src="/icons/quote.svg" size={IconSizes.SMALLER} />
                                        <p>{soldier.quote}</p>
                                    </blockquote> : null
                            }
                        </div>
                    </div>
                </div>

                {/* Military campaigns */}
                {
                    soldier.campaigns.length ?
                        <div className={`${styles.gridItem} ${styles.mobile}`}>
                            <div className={styles.section}>
                                <Heading type={HeadingTypes.H2} text={t('campaigns')} />
                                <div className={styles.sectionContent}>
                                    <BulletedList icon="/icons/star.svg" bullets={
                                        soldier.campaigns.map((campaign) => campaign.campaign.name)
                                    } />
                                </div>
                            </div>
                        </div> : null
                }
                <div className={`${styles.section} ${styles.fullWidth}`}>
                    {
                        soldier.photos.filter((photo) => photo.type === PhotoType.DOCUMENT).length ?
                            <Heading type={HeadingTypes.H2} text={t('documents')} /> : null
                    }
                    <div className={styles.documentsList}>
                        {
                            soldier.photos.filter((photo) => photo.type === PhotoType.DOCUMENT).length ?
                                soldier.photos.filter((photo) => photo.type === PhotoType.DOCUMENT).map((photo) => {
                                    return (
                                        <div key={photo.id} className={styles.documentItem}>
                                            <div className={styles.documentImage}>
                                                <Image
                                                    src={photo.url}
                                                    alt="Document image"
                                                    fill
                                                    className={styles.image}
                                                />
                                            </div>
                                            <p className={styles.documentCaption}>{photo.caption}</p>
                                        </div>
                                    );
                                }) : null
                        }
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