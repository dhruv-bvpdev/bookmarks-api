import { ForbiddenException, Injectable } from '@nestjs/common'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { PrismaService } from '@/prisma/prisma.service'
import { AuthDto } from '@/auth/dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password)
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      })

      delete user.hash

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken')
        }
      }
      throw error
    }
  }

  signin() {
    return 'I am the signin endpoint'
  }
}
