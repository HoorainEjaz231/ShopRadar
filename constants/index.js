export const categories = [
    {
      id: 1,
      name: 'Pizza',
     // image: require('../assets/images/pizza-icon.png')
    },
    {
      id: 2,
      name: 'Burgers',
      //image: require('../assets/images/burger-icon.png')
    },
    {
      id: 3,
      name: 'Pasta',
    //  image: require('../assets/images/pasta-icon.png')
    },
    {
      id: 4,
      name: 'Salads',
    //  image: require('../assets/images/salad-icon.png')
    },
    {
      id: 5,
      name: 'Sushi',
    //  image: require('../assets/images/sushi-icon.png')
    },
    {
      id: 6,
      name: 'Sandwiches',
    //  image: require('../assets/images/sandwich-icon.png')
    },
    {
      id: 7,
      name: 'Desserts',
    //  image: require('../assets/images/dessert-icon.png')
    },
    {
      id: 8,
      name: 'Drinks',
     // image: require('../assets/images/drink-icon.png')
    },
    {
      id: 9,
      name: 'Indian Cuisine',
     // image: require('../assets/images/indian-icon.png')
    },
    {
      id: 10,
      name: 'Chinese Cuisine',
     // image: require('../assets/images/chinese-icon.png')
    }
  ];

  export const featured = {
    id: 1,
    title: "Hot and Spicy",
    description: "Soft and tender fried chicken",
    restaurants: [
      {
        id: 1,
        name: "Papa Johns",
       image: require("../assets/foodiesfeed.com_burger-with-melted-cheese.jpg"),
        description: "Hot and spicy pizzas",
        lng: 74.255679, 
        lat: 31.430332,
        address: "1434 Second Street",
        stars: 4,
        reviews: "14.4k",
        category: "Fast Food",
        dishes: [
          {
            id: 1,
            name: "Pizza",
            category: "Main Course",
            description: "Cheesy garlic pizza",
            price: 10,
           // image: require("../assets/images/pizzaDish.png")
          },
          {
            id: 2,
            name: "Pepperoni Pizza",
            category: "Main Course",
            description: "Classic pepperoni pizza",
            price: 11.99,
           // image: require("../assets/images/pepperoniPizza.png")
          },
          {
            id: 3,
            name: "Chicken Wings",
            category: "Appetizer",
            description: "Spicy buffalo chicken wings",
            price: 8.99,
          //  image: require("../assets/images/chickenWings.png")
          },
          {
            id: 4,
            name: "Garlic Bread",
            category: "Appetizer",
            description: "Toasted garlic breadsticks",
            price: 4.99,
          //  image: require("../assets/images/garlicBread.png")
          },
          {
            id: 5,
            name: "Spicy Chicken Sandwich",
            category: "Sandwich",
            description: "Fried chicken sandwich with spicy sauce",
            price: 9.99,
           // image: require("../assets/images/chickenSandwich.png")
          },
          {
            id: 6,
            name: "Hot and Sour Soup",
            category: "Soup",
            description: "Traditional Chinese hot and sour soup",
            price: 5.99,
          //  image: require("../assets/images/hotSourSoup.png")
          },
          // Add more dishes as needed
        ]
      },

      {
        id: 2,
        name: "KFC",
        image: require("../assets/foodiesfeed.com_burger-with-melted-cheese.jpg"),
        description: "Hot and spicy pizzas",
        lng: 38.2145602,
        lat: -85.5324269,
        address: "1434 Second Street",
        stars: 4,
        reviews: "14.4k",
        category: "Fast Food",
        dishes: [
          {
            id: 1,
            name: "Pizza",
            category: "Main Course",
            description: "Cheesy garlic pizza",
            price: 10.99,
           // image: require("../assets/images/pizzaDish.png")
          },
          {
            id: 2,
            name: "Pepperoni Pizza",
            category: "Main Course",
            description: "Classic pepperoni pizza",
            price: 11.99,
           // image: require("../assets/images/pepperoniPizza.png")
          },
          {
            id: 3,
            name: "Chicken Wings",
            category: "Appetizer",
            description: "Spicy buffalo chicken wings",
            price: 8.99,
          //  image: require("../assets/images/chickenWings.png")
          },
          {
            id: 4,
            name: "Garlic Bread",
            category: "Appetizer",
            description: "Toasted garlic breadsticks",
            price: 4.99,
          //  image: require("../assets/images/garlicBread.png")
          },
          {
            id: 5,
            name: "Spicy Chicken Sandwich",
            category: "Sandwich",
            description: "Fried chicken sandwich with spicy sauce",
            price: 9.99,
           // image: require("../assets/images/chickenSandwich.png")
          },
          {
            id: 6,
            name: "Hot and Sour Soup",
            category: "Soup",
            description: "Traditional Chinese hot and sour soup",
            price: 5.99,
          //  image: require("../assets/images/hotSourSoup.png")
          },
          // Add more dishes as needed
        ]
      }
      // Add more restaurants as needed
    ]
  };
  