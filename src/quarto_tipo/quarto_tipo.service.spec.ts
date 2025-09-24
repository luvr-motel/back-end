import { Test, TestingModule } from '@nestjs/testing';
import { QuartoTipoService } from './quarto_tipo.service';

describe('QuartoTipoService', () => {
  let service: QuartoTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuartoTipoService],
    }).compile();

    service = module.get<QuartoTipoService>(QuartoTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
