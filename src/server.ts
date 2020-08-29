import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AllExceptionsFilter } from '@app/core/exceptionHandling/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors();

  app.use(
    compression({
      filter(req, res) {
        return /json|text|javascript|css|font|svg/.test(
          res.getHeader('Content-Type'),
        );
      },
      level: 9,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
