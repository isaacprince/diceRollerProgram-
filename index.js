function rollDice() {
  const numOfDice = document.getElementById("numOfDice").value;
  const diceResult = document.getElementById("diceResult");
  const diceImages = document.getElementById("diceImages");
  const values = [];
  const images = [];

  // the logic for rolling the dice

  const diceNames = ["One", "Two", "Three", "Four", "Five", "Six"];

  for (let i = 0; i < numOfDice; i++) {
    const value = Math.floor(Math.random() * 6) + 1;
    values.push(value);
    images.push(`<img src="./dice-img/dice${diceNames[value - 1]}.png" alt=" dice ${value} ">`);
  }

  // display the results --diceResult--
  diceResult.textContent = `dice : ${values.join(", ")}`;
  // display the images --diceImages--
  diceImages.innerHTML = images.join("");
}
