import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {

  console.log(">> FRONTEND_URL: ", process.env.FRONTEND_URL)
  
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: process.env.FRONTEND_URL })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
