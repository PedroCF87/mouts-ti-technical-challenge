import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super(process.env.REDIS_URL!)
  }

  onModuleInit() {
    this.on('connect', () => {
      console.log('Connected to Redis')
    })
    this.on('error', (err) => {
      console.error('Redis connection error:', err)
    })
  }

  onModuleDestroy() {
    this.quit()
  }
}
