import { Test, TestingModule } from '@nestjs/testing';
import { ReordersController } from './reorders.controller';
import { ReordersService } from './reorders.service';

describe('ReordersController', () => {
  let controller: ReordersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReordersController],
      providers: [ReordersService],
    }).compile();

    controller = module.get<ReordersController>(ReordersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
