import { numbersService } from '../src/numbers.service';

describe('NumbersService', () => {
  it('should generate random number', () => {
    const randomNumbers = numbersService.getRandomNumbers(3, 2, 1);

    expect(randomNumbers).toHaveLength(1);
  });
});
