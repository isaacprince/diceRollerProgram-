// Dice roller script
// - Attaches button listeners (no inline onclick)
// - Validates input, disables button while animating
// - Uses repeatTask to simulate rolling animation
// - Uses createElement instead of innerHTML, caches DOM nodes
// - Preloads dice images

document.addEventListener('DOMContentLoaded', () => {
  const diceNames = ['one', 'two', 'three', 'four', 'five', 'six']; // adjust if image naming differs
  const maxDice = 20;

  // Cache DOM nodes
  const numOfDiceInput = document.getElementById('numOfDice');
  const rollBtn = document.getElementById('rollBtn');
  const diceResult = document.getElementById('diceResult');
  const diceImages = document.getElementById('diceImages');

  // Preload images to avoid flicker
  const preloadImages = () => {
    diceNames.forEach((name) => {
      const img = new Image();
      img.src = `./dice-img/dice${name}.png`;
    });
  };
  preloadImages();

  // Utility: clamp and coerce input
  function getValidatedNumOfDice() {
    let n = Number(numOfDiceInput.value) || 1;
    n = Math.floor(n);
    if (n < 1) n = 1;
    if (n > maxDice) n = maxDice;
    return n;
  }

  // Main roll function
  function rollDice() {
    const numOfDice = getValidatedNumOfDice();

    const values = [];
    // clear previous visuals
    diceImages.innerHTML = '';
    for (let i = 0; i < numOfDice; i++) {
      const value = Math.floor(Math.random() * 6) + 1;
      values.push(value);

      const img = document.createElement('img');
      img.src = `./dice-img/dice${diceNames[value - 1]}.png`;
      img.alt = `dice ${value}`;

      // small random rotation for visual variety
      const angle = Math.floor(Math.random() * 360);
      img.style.transform = `rotate(${angle}deg)`;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.margin = '4px';
      img.setAttribute('aria-hidden', 'true');

      diceImages.appendChild(img);
    }

    diceResult.textContent = `dice : ${values.join(', ')}`;
  }

  /**
   * Repeat a callback a given number of times with a delay between calls.
   * Returns a Promise that resolves when finished (or rejected if aborted).
   *
   * @param {Function} callback - function to call
   * @param {number} times - how many times to call
   * @param {number} delay - ms between calls
   * @returns {Promise<void>}
   */
  function repeatTask(callback = () => {}, times = 15, delay = 50) {
    return new Promise((resolve) => {
      let count = 0;
      const intervalId = setInterval(() => {
        count += 1;
        try {
          callback();
        } catch (e) {
          // swallow errors in animation step but keep going
          // You could log to console for debugging
          console.error('repeatTask callback error:', e);
        }
        if (count >= times) {
          clearInterval(intervalId);
          resolve();
        }
      }, delay); // use the fixed delay param; don't decrement it
    });
  }

  // Prevent concurrent runs by disabling the button during animation
  rollBtn.addEventListener('click', async () => {
    // If button already disabled, ignore (prevents reentrancy)
    if (rollBtn.disabled) return;

    rollBtn.disabled = true;
    rollBtn.textContent = 'Rolling...';

    // Simulate a "rolling" animation by calling rollDice repeatedly
    try {
      await repeatTask(rollDice, 12, 60); // tune times/delay to taste
    } finally {
      rollBtn.disabled = false;
      rollBtn.textContent = 'Roll Dice';
      // final roll once more to ensure the last frame is decisive
      rollDice();
    }
  });
});
