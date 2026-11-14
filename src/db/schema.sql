-- Ejecutar en Supabase: SQL Editor > New query

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'cliente'
                CHECK (rol IN ('cliente', 'vendedor', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio      NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria   VARCHAR(80),
  imagen_url  TEXT,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  mensaje    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
