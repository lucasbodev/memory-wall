import Image from "next/image"
import styles from "@/app/[locale]/soldier/[id]/soldier.module.css"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import Icon, { IconSizes } from "@/components/icon/icon.component"
import Bulleted from "@/components/bulleted/bulleted.component"
import BulletedList from "@/components/bulleted-list/bulleted-list.component"
import { getSoldier } from "@/actions/soldier-actions"
import { getTranslations, getLocale } from "next-intl/server"
import { PhotoType } from "@prisma/client"
import DocumentCard from "@/components/document-card/document-card.component"

const Soldier = async ({ params }: { params: Promise<{ id: string }> }) => {

    const t = await getTranslations('Soldier');
    const { id } = await params;
    const soldier = await getSoldier(id);
    const currentLocale = await getLocale();

    if (currentLocale !== 'fr') {
        // soldier.rank!.name = soldier.rank?.translations.filter((t) => t.language === currentLocale)[0].name!;
        // soldier.unit!.name = soldier.unit?.translations.filter((t) => t.language === currentLocale)[0].name!;
        // soldier.birthplace = soldier.translations.filter((t) => t.fieldName === 'birthplace' && t.language === currentLocale)[0].value;
        soldier.biography = soldier.translations.filter((t) => t.fieldName === 'biography' && t.language === currentLocale)[0]?.value;
        // soldier.quote = soldier.translations.filter((t) => t.fieldName === 'quote' && t.language === currentLocale)[0]?.value;
        soldier.campaigns = soldier.campaigns.map((campaign) => ({
            ...campaign,
            campaign: {
                ...campaign.campaign,
                // name: campaign.campaign.translations.filter((t) => t.language === currentLocale)[0].name
            }
        }));
        soldier.medals = soldier.medals.map((medal) => ({
            ...medal,
            medal: {
                ...medal.medal,
                // name: medal.medal.translations.filter((t) => t.language === currentLocale)[0].name
            }
        }));
        soldier.photos = [
            soldier.photos.filter((photo) => photo.type === PhotoType.MAIN)[0],
            ...soldier.photos.filter((photo) => photo.type === PhotoType.DOCUMENT).map((photo) => ({
                ...photo,
                // caption: photo.caption = photo.translations.filter((t) => t.language === currentLocale)[0].caption
            }))
        ]
    }

    const formatDate = (date: Date): string => {
        const iso = date.toISOString().split('T')[0];
        const [year, month, day] = iso.split('-');
        return `${day}-${month}-${year}`;
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
                    <div className={styles.soldierName}>
                        <Heading type={HeadingTypes.H1} text={soldier.name} />
                    </div>
                    {

                    }
                    {
                        (soldier.rank || soldier.unit) ?
                            <div className={styles.rank}>
                                {
                                    soldier.rank ?
                                        <span>{soldier.rank?.name}</span> : null
                                }
                                {
                                    (soldier.rank && soldier.unit) ?
                                        <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} /> : null
                                }
                                {
                                    soldier.unit ?
                                        <span>{soldier.unit?.name}</span> : null
                                }
                            </div> : null
                    }
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
                        {
                            (soldier.rank || soldier.unit) ?
                                <div className={styles.rank}>
                                    {
                                        soldier.rank ?
                                            <span>{soldier.rank?.name}</span> : null
                                    }
                                    {
                                        (soldier.rank && soldier.unit) ?
                                            <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} /> : null
                                    }
                                    {
                                        soldier.unit ?
                                            <span>{soldier.unit?.name}</span> : null
                                    }
                                </div> : null
                        }
                    </div>
                    <div className={styles.personalDetails}>
                        {
                            soldier.born &&
                            <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                                <span>{t('born', { date: formatDate(soldier.born) })}</span>
                            </Bulleted>
                        }

                        {
                            soldier.died &&
                            <Bulleted startIcon="/icons/calendar.svg" iconSize={IconSizes.MEDIUM}>
                                <span>{t('died', { date: formatDate(soldier.died) })}</span>
                            </Bulleted>
                        }
                        {
                            soldier.birthplace &&
                            <Bulleted startIcon="/icons/location.svg" iconSize={IconSizes.MEDIUM}>
                                <span>{t('birthplace', { birthplace: soldier.birthplace })}</span>
                            </Bulleted>
                        }
                        {
                            (soldier.serviceStart && soldier.serviceEnd) ?
                                <Bulleted startIcon="/icons/flag.svg" iconSize={IconSizes.MEDIUM}>
                                    <span>{t('service', { serviceStart: soldier.serviceStart, serviceEnd: soldier.serviceEnd })}</span>
                                </Bulleted> :
                                null
                        }

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
                                        <BulletedList
                                            icon="/icons/star.svg"
                                            bullets={
                                                soldier.campaigns.map((campaign) => campaign.campaign.name)
                                            }
                                            lineHeight={"1.5rem"}
                                        />
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
                {
                    (soldier.biography || soldier.quote) ?
                        <div className={`${styles.gridItem} ${styles.fullWidth}`}>
                            <div className={styles.section}>
                                <Heading type={HeadingTypes.H2} text={t('biography')} startIcon="/icons/book.svg" />
                                <div className={styles.sectionContent}>
                                    {
                                        soldier.biography ?
                                            <p className={styles.biography} dangerouslySetInnerHTML={{ __html: soldier.biography }}>
                                                {/* {soldier.biography} */}
                                            </p> : null
                                    }

                                    {
                                        soldier.quote ?
                                            <blockquote className={styles.quote}>
                                                <Icon src="/icons/quote.svg" size={IconSizes.SMALLER} />
                                                <p>{soldier.quote}</p>
                                            </blockquote> : null
                                    }
                                </div>
                            </div>
                        </div> : null

                }


                {/* Military campaigns */}
                {
                    soldier.campaigns.length ?
                        <div className={`${styles.gridItem} ${styles.mobile}`}>
                            <div className={styles.section}>
                                <Heading type={HeadingTypes.H2} text={t('campaigns')} />
                                <div className={styles.sectionContent}>
                                    <BulletedList
                                        icon="/icons/star.svg"
                                        bullets={
                                            soldier.campaigns.map((campaign) => campaign.campaign.name)
                                        }
                                        lineHeight={"1.5rem"}
                                    />
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
                                        <DocumentCard key={photo.id} photo={photo} />
                                    );
                                }) : null
                        }
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Soldier;