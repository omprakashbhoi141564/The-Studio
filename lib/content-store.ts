import { SiteContent, StudioCard } from "@/lib/types";
import { getDbPool } from "@/lib/db";

async function ensureCardColumns() {
  const pool = getDbPool();
  await pool.query("ALTER TABLE cards ADD COLUMN IF NOT EXISTS section VARCHAR(20) NOT NULL DEFAULT 'character'");
  await pool.query("ALTER TABLE cards ADD COLUMN IF NOT EXISTS link_url TEXT NULL");
}

export async function readContent(): Promise<SiteContent> {
  await ensureCardColumns();
  const pool = getDbPool();

  const [[siteRows], [cardRows]] = await Promise.all([
    pool.query(
      `SELECT studio_name, logo, hero_image, hero_title, hero_subtitle,
              social_facebook, social_instagram, social_linkedin, social_youtube
       FROM site_content
       WHERE id = 1`
    ),
    pool.query(
      `SELECT id, title, description, image, sort_order, section, link_url
       FROM cards
       ORDER BY sort_order ASC`
    )
  ]);

  const siteResult = siteRows as Record<string, unknown>[];
  const cardsResult = cardRows as Record<string, unknown>[];

  if (siteResult.length === 0) {
    throw new Error("site_content row is missing. Run npm run db:init first.");
  }

  const site = siteResult[0];
  const cards: StudioCard[] = cardsResult.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    image: String(row.image),
    order: Number(row.sort_order),
    section: String(row.section || "character") === "poster" ? "poster" : "character",
    linkUrl: row.link_url ? String(row.link_url) : ""
  }));

  return {
    studioName: String(site.studio_name),
    logo: String(site.logo),
    hero: {
      image: String(site.hero_image),
      title: String(site.hero_title),
      subtitle: String(site.hero_subtitle)
    },
    cards,
    socialLinks: {
      facebook: String(site.social_facebook),
      instagram: String(site.social_instagram),
      linkedin: String(site.social_linkedin),
      youtube: String(site.social_youtube)
    }
  };
}

export async function writeContent(content: SiteContent): Promise<void> {
  await ensureCardColumns();
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE site_content
       SET studio_name = ?,
           logo = ?,
           hero_image = ?,
           hero_title = ?,
           hero_subtitle = ?,
           social_facebook = ?,
           social_instagram = ?,
           social_linkedin = ?,
           social_youtube = ?,
           updated_at = NOW()
       WHERE id = 1`,
      [
        content.studioName,
        content.logo,
        content.hero.image,
        content.hero.title,
        content.hero.subtitle,
        content.socialLinks.facebook,
        content.socialLinks.instagram,
        content.socialLinks.linkedin,
        content.socialLinks.youtube
      ]
    );

    await connection.query("DELETE FROM cards");

    const sortedCards = [...content.cards].sort((a, b) => a.order - b.order);

    for (let index = 0; index < sortedCards.length; index += 1) {
      const card = sortedCards[index];
      await connection.query(
        `INSERT INTO cards (id, title, description, image, sort_order, section, link_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [card.id, card.title, card.description, card.image, index + 1, card.section || "character", card.linkUrl || ""]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export function createCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
