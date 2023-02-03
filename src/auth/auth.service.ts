import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signup() {
    return 'I am the signup endpoint'
  }
  signin() {
    return 'I am the signin endpoint'
  }
}
