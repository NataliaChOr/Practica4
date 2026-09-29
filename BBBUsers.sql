IF OBJECT_ID('users', 'U') IS NOT NULL
    DROP TABLE users;
GO

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    preguntarc VARCHAR(255) NULL,
    respuestarc VARCHAR(255) NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Operativo',
    activo BIT NOT NULL DEFAULT 1
);
GO

-- Inserta el usuario inicial con los campos completos
INSERT INTO users (nombre, correo, contrasena, preguntarc, respuestarc, rol, activo)
VALUES ('Andrea', 'andrea@correo.com', '12345678', 'mascota', 'pancho', 'admin', 1);
GO

SELECT * FROM users;
GO