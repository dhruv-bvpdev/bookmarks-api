import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  signup() {
    return 'I am the signup endpoint'
  }
  signin() {
    return 'I am the signin endpoint'
  }
}
