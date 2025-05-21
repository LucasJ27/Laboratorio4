import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsuarios = async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  usuario
    ? res.json(usuario)
    : res.status(404).json({ error: "Usuario no encontrado" });
};

export const createUsuario = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(usuario);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, password: hashedPassword },
    });
    res.json(usuario);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({ where: { id } });
    res.json({ message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
