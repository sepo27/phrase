import { PhraseTMock } from './PhraseTMock';
import { PhraseTTest } from './PhraseTTest';

export class PhraseTBench {
  constructor() {
    this.mock = new PhraseTMock();
    this.test = new PhraseTTest(this.mock);
  }

  public readonly mock: PhraseTMock;
  public readonly test: PhraseTTest;

  public restore() { this.mock.restore(); }
}
