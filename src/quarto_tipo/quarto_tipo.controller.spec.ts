import { Test, TestingModule } from '@nestjs/testing';
import { QuartoTipoController } from './quarto_tipo.controller';
import { QuartoTipoService } from './quarto_tipo.service';

describe('QuartoTipoController', () => {
  let controller: QuartoTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuartoTipoController],
      providers: [QuartoTipoService],
    }).compile();

    controller = module.get<QuartoTipoController>(QuartoTipoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
