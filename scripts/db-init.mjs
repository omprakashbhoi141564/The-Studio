import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";

async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");

  try {
    const raw = await fs.readFile(envPath, "utf-8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;

      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing .env.local; explicit env vars may still be provided.
  }
}

function getSslConfig() {
  if (process.env.DB_SSL === "false") {
    return undefined;
  }

  return { rejectUnauthorized: false };
}

function getMysqlUri() {
  const parsed = new URL(process.env.DATABASE_URL);
  parsed.searchParams.delete("ssl-mode");
  parsed.searchParams.delete("sslmode");
  return parsed.toString();
}

async function main() {
  await loadLocalEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Add it to .env.local first.");
  }

  const connection = await mysql.createConnection({
    uri: getMysqlUri(),
    ssl: getSslConfig(),
    multipleStatements: true
  });

  try {
    const schemaPath = path.join(process.cwd(), "db", "schema.sql");
    const schemaSql = await fs.readFile(schemaPath, "utf-8");
    await connection.query(schemaSql);

    const contentPath = path.join(process.cwd(), "data", "content.json");
    const contentRaw = await fs.readFile(contentPath, "utf-8");
    const content = JSON.parse(contentRaw);

    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO site_content (
         id, studio_name, logo, hero_image, hero_title, hero_subtitle,
         social_facebook, social_instagram, social_linkedin, social_youtube
       )
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         studio_name = VALUES(studio_name),
         logo = VALUES(logo),
         hero_image = VALUES(hero_image),
         hero_title = VALUES(hero_title),
         hero_subtitle = VALUES(hero_subtitle),
         social_facebook = VALUES(social_facebook),
         social_instagram = VALUES(social_instagram),
         social_linkedin = VALUES(social_linkedin),
         social_youtube = VALUES(social_youtube)`,
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
      const section = card.section === "poster" ? "poster" : index < 3 ? "poster" : "character";
      const linkUrl = card.linkUrl || "";
      await connection.query(
        `INSERT INTO cards (id, title, description, image, sort_order, section, link_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           image = VALUES(image),
           sort_order = VALUES(sort_order),
           section = VALUES(section),
           link_url = VALUES(link_url)`,
        [card.id, card.title, card.description, card.image, index + 1, section, linkUrl]
      );
    }

    await connection.commit();
    console.log("MySQL database initialized and seeded from data/content.json");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
