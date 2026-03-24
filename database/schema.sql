CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  label TEXT,
  address TEXT,
  zip_code TEXT,
  lat FLOAT,
  lng FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alert_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email_alerts BOOLEAN DEFAULT TRUE,
  alert_frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);