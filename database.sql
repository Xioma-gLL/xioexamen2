-- ============================================================
--  Base de datos: xioexamen2  (MySQL)
--  Sequelize sincroniza las tablas automáticamente al arrancar.
--  Este script es solo referencia / creación manual.
-- ============================================================

CREATE DATABASE IF NOT EXISTS xioexamen2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE xioexamen2;

-- ------------------------------------------------------------
--  Tabla: clientes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  Tabla: reservas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
  id_reserva      INT AUTO_INCREMENT PRIMARY KEY,
  fecha           DATE         NOT NULL,
  comprobante_img VARCHAR(255) DEFAULT NULL,
  id_cliente      INT          NOT NULL,
  CONSTRAINT fk_reservas_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  Datos de ejemplo
-- ------------------------------------------------------------
INSERT INTO clientes (nombre) VALUES
  ('Ana García'),
  ('Carlos López'),
  ('María Rodríguez');

INSERT INTO reservas (fecha, id_cliente) VALUES
  ('2026-05-10', 1),
  ('2026-05-15', 2),
  ('2026-05-20', 3);
