import type { Sweet } from "@/schema/sweet";

const sweetNames = [
  "Chocolate Brownie", "Vanilla Cupcake", "Strawberry Cake", "Lemon Tart", "Apple Pie",
  "Cheesecake", "Tiramisu", "Macarons", "Éclair", "Profiterole",
  "Donut", "Cookie", "Muffin", "Scone", "Croissant",
  "Danish Pastry", "Cinnamon Roll", "Bagel", "Pretzel", "Waffle",
  "Pancake", "Crepe", "Soufflé", "Pudding", "Custard",
  "Ice Cream", "Sorbet", "Gelato", "Frozen Yogurt", "Milkshake",
  "Candy Bar", "Lollipop", "Gummy Bears", "Chocolate Truffle", "Fudge",
  "Caramel", "Toffee", "Nougat", "Marshmallow", "Jellybean",
  "Rock Candy", "Cotton Candy", "Peppermint", "Licorice", "Sour Patch",
  "Gumdrops", "Chocolate Chip Cookie", "Oatmeal Cookie", "Sugar Cookie", "Snickerdoodle",
  "Peanut Butter Cookie", "Shortbread", "Biscotti", "Ladyfinger", "Wafer",
  "Baklava", "Churros", "Beignet", "Funnel Cake", "Zeppole",
  "Cannoli", "Strudel", "Galette", "Cobbler", "Crisp",
  "Trifle", "Panna Cotta", "Crème Brûlée", "Flan", "Mousse",
  "Parfait", "Sundae", "Float", "Smoothie", "Frappé",
  "Hot Chocolate", "Chai Latte", "Matcha Latte", "Cappuccino", "Espresso",
  "Affogato", "Granita", "Semifreddo", "Zabaglione", "Sabayon",
  "Clafoutis", "Financier", "Madeleine", "Opera Cake", "Mille-feuille",
  "Paris-Brest", "Saint-Honoré", "Croquembouche", "Gateau", "Torte",
  "Black Forest Cake", "Red Velvet Cake", "Carrot Cake", "Pound Cake", "Angel Food Cake",
  "Devil's Food Cake", "Upside Down Cake", "Bundt Cake", "Layer Cake", "Sheet Cake",
  "Cupcake Tower", "Cake Pop", "Truffle Ball", "Chocolate Bark", "Praline"
];

const categories = [
  "Chocolate", "Vanilla", "Strawberry", "Caramel", "Mint",
  "Cake", "Cookie", "Pastry", "Candy", "Ice Cream",
  "Tart", "Pie", "Muffin", "Donut", "Macaron",
  "Truffle", "Fudge", "Gummy", "Hard Candy", "Lollipop"
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(): number {
  return Math.round((Math.random() * 500 + 10) * 100) / 100;
}

function getRandomQuantity(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function generateDummySweets(count: number = 25): Omit<Sweet, "id">[] {
  const usedNames = new Set<string>();
  const dummySweets: Omit<Sweet, "id">[] = [];

  for (let i = 0; i < count; i++) {
    let name = getRandomElement(sweetNames);
    
    // Ensure unique names by adding a number if needed
    let counter = 1;
    const originalName = name;
    while (usedNames.has(name)) {
      name = `${originalName} ${counter}`;
      counter++;
    }
    usedNames.add(name);

    const sweet: Omit<Sweet, "id"> = {
      name,
      category: getRandomElement(categories),
      price: getRandomPrice(),
      quantity: getRandomQuantity(),
    };

    dummySweets.push(sweet);
  }

  return dummySweets;
}