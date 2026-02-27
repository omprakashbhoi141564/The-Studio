CREATE TABLE IF NOT EXISTS site_content (
  id INT PRIMARY KEY,
  studio_name TEXT NOT NULL,
  logo TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  social_facebook TEXT NOT NULL,
  social_instagram TEXT NOT NULL,
  social_linkedin TEXT NOT NULL,
  social_youtube TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cards_sort_order (sort_order)
);
