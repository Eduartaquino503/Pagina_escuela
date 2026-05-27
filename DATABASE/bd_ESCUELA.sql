-- 1. LIMPIEZA Y CREACIÓN
DROP DATABASE IF EXISTS escuela_walter;
CREATE DATABASE escuela_walter;
USE escuela_walter;

-- 2. TABLA DE ROLES (Independiente)
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- 3. TABLA DE USUARIOS (Depende de roles)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    usuarioID VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, 
    id_rol INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    activo TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- 4. TABLA DE INFORMACIÓN INSTITUCIONAL (Para el módulo "Información General")
CREATE TABLE institucion_config (
    id_config INT PRIMARY KEY AUTO_INCREMENT,
    quienes_somos TEXT NOT NULL,
    mision TEXT NOT NULL,
    vision TEXT NOT NULL,
    ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_usuario_editor INT,
    CONSTRAINT fk_editor_config FOREIGN KEY (id_usuario_editor) REFERENCES usuarios(id_usuario)
);

-- 5. TABLA DE OFERTA ACADÉMICA (Para el módulo "Editar Grados")
CREATE TABLE grados (
    id_grado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grado VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    id_usuario_editor INT,
    CONSTRAINT fk_editor_grado FOREIGN KEY (id_usuario_editor) REFERENCES usuarios(id_usuario)
);

ALTER TABLE grados 
ADD COLUMN tipo VARCHAR(20) NOT NULL DEFAULT 'GRADO';

-- 6. TABLA DE MULTIMEDIA (Para el módulo "Editar Imágenes")
CREATE TABLE multimedia (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    seccion VARCHAR(50) NOT NULL, -- 'hero', 'mision', 'vision', 'galeria'
    ruta_archivo VARCHAR(255) NOT NULL,
    nombre_original VARCHAR(150),
    id_usuario_editor INT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_editor_multimedia FOREIGN KEY (id_usuario_editor) REFERENCES usuarios(id_usuario)
);

-- ==========================================
-- INSERT DE DATOS INICIALES (AUDITORÍA)
-- ==========================================

-- Insertar roles básicos
INSERT INTO roles (nombre_rol) VALUES ('Administrador'), ('Director');

-- Insertar Usuario Admin inicial
-- (Nota: Para el HP Server, recuerda que luego usaremos hashes de BCrypt en Java)
INSERT INTO usuarios (nombre_completo, correo, usuarioID, password_hash, id_rol) 
VALUES ('Jose Eduardo Aquino', 'admin@cewas.edu.sv', 'admin', 'Admin123!', 1);
INSERT INTO usuarios (nombre_completo, correo, usuarioID, password_hash, id_rol) 
VALUES ('Andres Wilfredo Somoza', 'andressomoza23@gmail.com', 'adminjr', '12345678910', 1);

-- Insertar contenido base para que el portal cargue información
INSERT INTO institucion_config (quienes_somos, mision, vision, id_usuario_editor) 
VALUES (
    'El Complejo Educativo Walter A. Soundy es una institución pública ubicada en Santa Tecla...', 
    'Brindar educación integral de calidad...', 
    'Ser una institución educativa reconocida por su excelencia...',
    1
);