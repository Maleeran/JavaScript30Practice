// start with strings, numbers and booleans
let name = 'Aaron';
let age = 18;
let isFunny = true;

let name2 = name;
let age2 = age;
let isFunny2 = isFunny;
isFunny2 = false;
age2 = 100;
name2 = 'John';

console.log(name2, age2, isFunny2);
console.log(name, age, isFunny);

// Let's say we have an array
const players = ['Wes', 'Sarah', 'Ryan', 'Poppy'];

// and we want to make a copy of it.
// const team = players;
// You might think we can just do something like this:
// console.log(team, players);
// however what happens when we update that array?
// team[3] = 'John';

// now here is the problem!
// console.log(team, players);
// oh no - we have edited the original array too!

// Why? It's because that is an array reference, not an array copy. They both point to the same array!

// So, how do we fix this? We take a copy instead!

// one way
// const team = players.slice();
// console.log(team);
// team[0] = 'Aaron';
// console.log(team, players);
// or create a new array and concat the old one in
// const team = [].concat(players);
// team[0] = 'Aaron';
// console.log(team, players);
// or use the new ES6 Spread
// const team = [...players];
// team[0] = 'Aaron';
// console.log(team, players);
// Array.from()
const team = Array.from(players);
team[0] = 'Aaron';
console.log(team, players);
// now when we update it, the original one isn't changed

// The same thing goes for objects, let's say we have a person object

// with Objects
const person = {
  name: 'Wes Bos',
  age: 80,
};

// and think we make a copy:

// how do we take a copy instead?

// We will hopefully soon see the object ...spread
const newObj = { ...person };
console.log(newObj);

// Things to note - this is only 1 level deep - both for Arrays and Objects. lodash has a cloneDeep method, but you should think twice before using it.
// JSON.parse(JSON.stringify())
const wes = {
  name: 'Wes Bos',
  age: 80,
  social: {
    twitter: '@wesbos',
    facebook: 'wesbos.developer',
  },
};
const dev = JSON.parse(JSON.stringify(wes));
