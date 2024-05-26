import { Test, TestingModule } from '@nestjs/testing';
import { ReordersService } from './reorders.service';

describe('ReordersService', () => {
  let service: ReordersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReordersService],
    }).compile();

    service = module.get<ReordersService>(ReordersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
