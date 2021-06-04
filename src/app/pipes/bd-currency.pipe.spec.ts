import { BdCurrencyPipe } from './bd-currency.pipe';

describe('BdCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new BdCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
