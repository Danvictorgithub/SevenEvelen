import { Test, TestingModule } from '@nestjs/testing';
import { XenditController } from './xendit.controller';
import { XenditService } from './xendit.service';

describe('XenditController', () => {
  let controller: XenditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XenditController],
      providers: [XenditService],
    }).compile();

    controller = module.get<XenditController>(XenditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
