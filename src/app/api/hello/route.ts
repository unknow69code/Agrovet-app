import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import {prisma} from "@/libs/db";

await prisma.$connect();
// Removed duplicate declaration of prisma

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ ok: true, message: 'Conexión exitosa a la base de datos' })
  } catch (error) {
    console.error('Error al conectar con Prisma:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
