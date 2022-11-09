import { PrismaClient } from '@prisma/client'

class Database extends PrismaClient {}

const database = new Database()

export default database
