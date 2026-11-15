-- Ejecutar en Supabase: SQL Editor > New query

CREATE TABLE IF NOT EXISTS users (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run              VARCHAR(9)   NOT NULL UNIQUE,
  nombre           VARCHAR(50)  NOT NULL,
  apellidos        VARCHAR(100) NOT NULL,
  correo           VARCHAR(100) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  tipo             VARCHAR(20)  NOT NULL DEFAULT 'Cliente'
                   CHECK (tipo IN ('Administrador', 'Vendedor', 'Cliente')),
  fecha_nacimiento DATE,
  region           VARCHAR(100) NOT NULL,
  comuna           VARCHAR(100) NOT NULL,
  direccion        VARCHAR(300) NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Correo unico sin distinguir mayusculas
CREATE UNIQUE INDEX IF NOT EXISTS users_correo_unico ON users (lower(correo));

CREATE TABLE IF NOT EXISTS products (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo        VARCHAR(50)  NOT NULL UNIQUE CHECK (char_length(codigo) >= 3),
  nombre        VARCHAR(100) NOT NULL,
  descripcion_corta VARCHAR(100),
  descripcion   VARCHAR(500),
  categoria     VARCHAR(20)  NOT NULL
                CHECK (categoria IN ('interior', 'exterior', 'macetas', 'sustratos', 'herramientas')),
  precio        INTEGER      NOT NULL CHECK (precio >= 0),
  stock         INTEGER      NOT NULL DEFAULT 0 CHECK (stock >= 0),
  stock_critico INTEGER      CHECK (stock_critico >= 0),
  imagen        TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  correo     VARCHAR(100) NOT NULL,
  comentario VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);