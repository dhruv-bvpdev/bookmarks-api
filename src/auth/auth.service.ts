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

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user) throw new ForbiddenException('Credentials incorrect')

    const pwMatches = await argon.verify(user.hash, dto.password)

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

    delete user.hash
    return user
  }
}
