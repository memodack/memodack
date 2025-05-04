import { NumbersService } from '../src/services/numbers.service';

describe('NumbersService', () => {
  it('should generate random number', () => {
    const numbersService = new NumbersService();
    const randomNumbers = numbersService.getRandomNumbers(3, 2, 1);

    expect(randomNumbers).toHaveLength(1);
  });
});
