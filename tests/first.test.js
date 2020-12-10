const {
  calculateTip,
  addAsync
} = require('../src/first');


test('Hello', () => {
  expect(2 + 2).toBe(4);
});

test('calculateTip function', () => {
  const total = calculateTip(10, .3);
  expect(total).toBe(13);
});

test('addAsync function', (done) => {
  addAsync(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });

})

test('addAsync function async/await', async () => {
  const sum = await addAsync(10, 20);
  expect(sum).toBe(30);
})