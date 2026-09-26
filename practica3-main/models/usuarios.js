import { readFile, writeFile } from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../data/", "users.json");


export const readUsers = async () => {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
};

export const updatePassword = async (email, respuesta, nuevaPassword) => {
  try {
    const users = await readUsers();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.respuesta.toLowerCase() === respuesta.toLowerCase()
    );

    if (!user) return null;

    user.password = nuevaPassword;

    await writeFile(FILE_PATH, JSON.stringify(users, null, 2));

    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};


export const createUser = async (newUser) => {
  try {
    const users = await readUsers();

    // verificar si ya existe
    const exists = users.find(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (exists) return null;

  users.push({
    email: newUser.email,
    password: newUser.password,
    pregunta: newUser.pregunta,
    respuesta: newUser.respuesta
  });

    await writeFile(FILE_PATH, JSON.stringify(users, null, 2));

    return newUser;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const users = await readUsers();

    const user = users.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    return user || null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};