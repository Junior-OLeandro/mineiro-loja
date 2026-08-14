import type { Product } from "../types";
import {baconDocinho, batata, batataCb, batataCc, boiDoido, caramelizado, chicoBento, chimiburguer, comboMineiro, comboTremBao, comboTropical, coca, coca600, cocaZero, cocaZero600, guarana, guaranaZero, mineiro, romeu, smashBacon, smashCheese, smashMineiro, tropical, tremBao} from "../assets/images";

import { burgerExtraIds } from "./extras";

export const products: Product[] = [

  {
    id: "1",
    categoryId: "combos",
    name: "Combo Trem Bão",
    description:
      "Trem Bão + Batata Individual + Refri 350ml (2 Bifes artesanais de 160g cada, fatias de cheddar, tiras de bacon e barbecue. Acompanha maionese mineira.)",
    price: 57.9,
    image: comboTremBao,
    alt: "Hamburguer com batata e refri",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "2",
    categoryId: "combos",
    name: "Combo Mineiro",
    description:
      "Mineiro + Batata Individual + Refri 350ml (Bife artesanal 160g, queijo canastra, banana da terra frita, tiras de bacon, melado de cana e couve crispy. Acompanha maionese caseira.)",
    price: 49.9,
    image: comboMineiro,
    alt: "Hamburguer com batata e refri",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "3",
    categoryId: "combos",
    name: "Combo Tropical",
    description:
      "Tropical + Batata Individual + Refri 350ml (Bife artesanal 160g, fatias de cheddar, cream cheese, tiras de bacon e chutney de abacaxi. Acompanha maionese mineira.)",
    price: 47.9,
    image: comboTropical,
    alt: "Hamburguer com batata e refri",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "4",
    categoryId: "hamburgueres",
    name: "Mineiro",
    description:
      "Bife artesanal 160g, queijo canastra, banana da terra frita, tiras de bacon, melado de cana e couve crispy. Acompanha maionese caseira",
    price: 36.9,
    image: mineiro,
    alt: "Hamburguer Mineiro com queijo bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "5",
    categoryId: "hamburgueres",
    name: "Chico Bento no Shopping",
    description:
      "Bife artesanal 160g, fatias de cheddar, tiras de bacon e pesto mineiro com amendoim. Acompanha maionese mineira.",
    price: 34.9,
    image: chicoBento,
    alt: "Hamburguer Chico Bento com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "6",
    categoryId: "hamburgueres",
    name: "Romeu e Julieta",
    description:
      "Bife artesanal 160g, queijo canastra, tiras de bacon, ketchup de goiabada e salada de alface e tomate. Acompanha maionese mineira.",
    price: 34.9,
    image: romeu,
    alt: "Hamburguer Romeu e Julieta com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "7",
    categoryId: "hamburgueres",
    name: "Bacon Docinho",
    description:
      "Bife artesanal 160g, fatias de cheddar, requeijão, bacon caramelado e picles de cebola roxa. Acompanha maionese mineira.",
    price: 35.9,
    image: baconDocinho,
    alt: "Hamburguer Bacon Docinho com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "8",
    categoryId: "hamburgueres",
    name: "Chimiburguer",
    description:
      "Bife artesanal 160g, fatias de cheddar, tiras de bacon, tomate confiti e chimichurri. Acompanha maionese mineira.",
    price: 36.9,
    image: chimiburguer,
    alt: "Hamburguer Chimiburguer com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "9",
    categoryId: "hamburgueres",
    name: "Tropical",
    description:
      "Bife artesanal 160g, fatias de cheddar, cream cheese, tiras de bacon e chutney de abacaxi. Acompanha maionese mineira.",
    price: 35.9,
    image: tropical,
    alt: "Hamburguer Tropical com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "10",
    categoryId: "hamburgueres",
    name: "Caramelizado",
    description:
      "Bife artesanal 160g, fatias de cheddar, tiras de bacon e cebola caramelizada. Acompanha maionese mineira.",
    price: 29.9,
    image: caramelizado,
    alt: "Hamburguer Caramelizado com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "11",
    categoryId: "hamburgueres",
    name: "Boi Doido",
    description:
      "Bifes artesanal 160g, fatias de cheddar, tiras de bacon, requeijão e costela bovina desfiada. Acompanha maionese mineira.",
    price: 38.9,
    image: boiDoido,
    alt: "Hamburguer com carne desfiada com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },

  {
    id: "12",
    categoryId: "hamburgueres",
    name: "Trem Bão",
    description:
      "2 Bifes artesanais de 160g cada, fatias de cheddar, tiras de bacon e barbecue. Acompanha maionese mineira.",
    price: 44.9,
    image: tremBao,
    alt: "Hamburguer Trem Bão com queijo e bacon",
    hasMeatChoice: true,
    hasMeatPoint: true,
    extraIds: burgerExtraIds,
  },


  {
    id: "13",
    categoryId: "smashs",
    name: "Smash Bacon",
    description:
      "Smash burguer 70g, cheddar fatiado, tiras de bacon, barbecue e salada de alface e tomate. Acompanha maionese mineira.",
    image: smashBacon,
    alt: "Smash burguer com queijo e bacon",
    prices: {
      simples: 22.9,
      duplo: 30.9,
      triplo: 37.9,
    },
    extraIds: burgerExtraIds,
  },

  {
    id: "14",
    categoryId: "smashs",
    name: "Smash Cheese",
    description:
      "Smash burguer 70g, cream cheese, bacon e salada de alface e tomate. Acompanha maionese mineira.",
    image: smashCheese,
    alt: "Smash cheese burguer com queijo e bacon",
    prices: {
      simples: 23.9,
      duplo: 30.9,
      triplo: 37.9,
    },
    extraIds: burgerExtraIds,
  },

  {
    id: "15",
    categoryId: "smashs",
    name: "Smash Mineiro",
    description:
      "Smash burguer 70g, cheddar fatiado, requeijão, tiras de bacon, picles de cebola roxa e salada de alface e tomate. Acompanha maionese mineira.",
    image: smashMineiro,
    alt: "Smash Mineiro burguer com queijo e bacon",
    prices: {
      simples: 24.9,
      duplo: 31.9,
      triplo: 38.9,
    },
    extraIds: burgerExtraIds,
  },

  {
    id: "16",
    categoryId: "smashs",
    name: "Smashizinho",
    description:
      "Smash burguer 70g, cheddar fatiado e salada de alface e tomate. Acompanha maionese mineira.",
    image: smashBacon,
    alt: "Smashizinho Smash burguer com queijo e salada",
    prices: {
      simples: 17.9,
      duplo: 24.9,
      triplo: 32.9,
    },
    extraIds: burgerExtraIds,
  },


  {
    id: "17",
    categoryId: "acompanhamentos",
    name: "Batata Frita",
    description: "Batata frita simples",
    price: 12.9,
    image: batata,
    alt: "Batata Frita",
  },

  {
    id: "18",
    categoryId: "acompanhamentos",
    name: "Batata, cheddar e costela desfiada",
    description:
      "Batata frita com cheddar, costela desfiada e finalizada com queijo canastra ralado",
    price: 29.9,
    image: batataCc,
    alt: "Batata Especial",
  },

  {
    id: "19",
    categoryId: "acompanhamentos",
    name: "Batata, cheddar e bacon",
    description: "Batata frita com cheddar e bacon",
    price: 24.9,
    image: batataCb,
    alt: "Batata Especial",
  },


  {
    id: "20",
    categoryId: "bebidas",
    name: "Coca-Cola 350ml",
    description: "",
    price: 7,
    image: coca,
    alt: "Coca Cola",
  },

  {
    id: "21",
    categoryId: "bebidas",
    name: "Coca-Cola Zero 350ml",
    description: "",
    price: 7,
    image: cocaZero,
    alt: "Coca Zero",
  },

  {
    id: "22",
    categoryId: "bebidas",
    name: "Guaraná 350ml",
    description: "",
    price: 7,
    image: guarana,
    alt: "Guaraná",
  },

  {
    id: "23",
    categoryId: "bebidas",
    name: "Guaraná Zero 350ml",
    description: "",
    price: 7,
    image: guaranaZero,
    alt: "Guaraná",
  },

  {
    id: "24",
    categoryId: "bebidas",
    name: "Coca-Cola 600ml",
    description: "",
    price: 9,
    image: coca600,
    alt: "Coca-cola 600ml",
  },

  {
    id: "25-bebida-coca-zero-600",
    categoryId: "bebidas",
    name: "Coca-Cola Zero 600ml",
    description: "",
    price: 9,
    image: cocaZero600,
    alt: "Coca-cola 600ml",
  },
];