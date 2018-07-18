import React from 'react';
import ListSelection from './ListSelection';
const importImages = require.context('./assets', true, /\.svg$/);

const imgFilesObject = importImages.keys().reduce((images, key) => {
	images[key] = importImages(key);
	return images;
}, {});

const test = () => {
	const items = [
		{
			id: 'fbe05463-a538-47aa-b4f1-654faa0a5b82',
			name: 'Granulated Sugar',
			qualifier: '2 Teaspoons',
			image: 'misc-bar.svg',
			isMarketplace: true,
			count: 979,
			price: {
				total: 6,
				breakdown: {
					wholesaleCost: 5,
					serviceFee: 1,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '318ff9ec-4cd3-4eff-8f12-76f1e3ffa835'
		},
		{
			id: 'f589039e-c93b-45c1-99fc-1ee457ecb570',
			name: 'Wotsits',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: false,
			count: 0,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'e615de4e-ce10-451b-80ad-9717662a904a',
			name: 'Pepsi Max',
			qualifier: null,
			image: 'pepsi-max-can.svg',
			isMarketplace: false,
			count: -8,
			price: {
				total: 38,
				breakdown: {
					wholesaleCost: 34,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'ff1ddc0b-3b8a-4621-8790-f214c7a60ad4',
			name: 'Diet Pepsi',
			qualifier: null,
			image: 'diet-pepsi-can.svg',
			isMarketplace: false,
			count: 10,
			price: {
				total: 38,
				breakdown: {
					wholesaleCost: 34,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '21125f1b-5e59-4bd8-ba5e-7ed58ff5af52',
			name: 'Clif Bar',
			qualifier: null,
			image: 'misc-bar',
			isMarketplace: true,
			count: 0,
			price: {
				total: 143,
				breakdown: {
					wholesaleCost: 130,
					serviceFee: 13,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: 'f57ec434-2ff8-4bbc-ab4f-6ceafb5403e6'
		},
		{
			id: 'db9990e4-f669-4c80-98d2-ef0ce75ab982',
			name: 'Sprite Zero',
			qualifier: null,
			image: 'misc-can.svg',
			isMarketplace: false,
			count: 5,
			price: {
				total: 40,
				breakdown: {
					wholesaleCost: 36,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '8e474d3f-5a32-45a1-9214-7b8e2361d221',
			name: 'Picnic bar',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 1,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '220cdfb9-31a4-4150-a109-2e24ca24e1dc',
			name: 'Crunchie',
			qualifier: null,
			image: 'crunchie.svg',
			isMarketplace: false,
			count: -2,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'ccad58e3-e27a-4463-9139-17a36ff7f7b8',
			name: 'Coke',
			qualifier: null,
			image: 'coca-cola-can.svg',
			isMarketplace: false,
			count: 52,
			price: {
				total: 42,
				breakdown: {
					wholesaleCost: 38,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'fbbf6cb9-a1b8-49c5-83d3-c13c385ad455',
			name: 'Fanta Zero',
			qualifier: null,
			image: 'misc-can.svg',
			isMarketplace: false,
			count: 5,
			price: {
				total: 40,
				breakdown: {
					wholesaleCost: 36,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '55dcb8be-4257-4c06-9507-1f698a40dfef',
			name: 'Aero',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 23,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '83f5f7c5-75c3-4324-8912-65b1696bc857',
			name: 'Caramel',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 3,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'a3afbc77-53b2-41a3-ab85-56ee11e45945',
			name: 'Frazzles',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: false,
			count: 13,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'c1cef041-fe9d-49a7-9e06-b04ea1252339',
			name: 'Polos',
			qualifier: null,
			image: 'Polos',
			isMarketplace: false,
			count: 6,
			price: {
				total: 44,
				breakdown: {
					wholesaleCost: 40,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '5afe3d67-aff9-420f-94e5-30c6bedda819',
			name: 'Quavers',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: false,
			count: 24,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '0914a1fa-cbc9-493a-b151-c78ee249dd39',
			name: 'Toffee Crisp',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 12,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'f01f533f-8bf6-4291-8fb8-a76c3bedc276',
			name: 'Twirl twin bar',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 1,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'eb34ac84-0431-45f5-b9d5-bdf459ee1ce3',
			name: 'Aero Mint',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 24,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '685873a1-414a-4631-814b-b495bae5a349',
			name: 'Bounty',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 31,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'd5d10152-3f8a-419b-9abd-6d6e916ea64a',
			name: 'Coke Zero',
			qualifier: null,
			image: 'coca-cola-zero-can.svg',
			isMarketplace: false,
			count: 7,
			price: {
				total: 42,
				breakdown: {
					wholesaleCost: 38,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '219d89cd-a7f9-4ffe-90e5-e2193a71a044',
			name: 'Curly Wurly',
			qualifier: null,
			image: 'curly-wurly.svg',
			isMarketplace: false,
			count: 12,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '190ee06f-455f-4778-b3db-1dfc74c3e966',
			name: 'Diet Coke',
			qualifier: null,
			image: 'diet-cola-can.svg',
			isMarketplace: false,
			count: 210,
			price: {
				total: 42,
				breakdown: {
					wholesaleCost: 38,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'eb3c8771-0cb0-4410-9863-f5cc30e9c85d',
			name: 'Double Decker',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 13,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '177f0cd3-bc1f-4243-a0b8-bb8cbac15370',
			name: 'Fudge',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 35,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'e46f081f-cfd8-49a0-aa6b-b6ab7fd0d82f',
			name: 'Hula Hoops',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: false,
			count: 87,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '1799e858-2beb-4613-b3c5-2381ac77c6a0',
			name: "Jacob's",
			qualifier: 'Mini Cheddars',
			image: 'mini-cheddars.svg',
			isMarketplace: false,
			count: 64,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '02bbc0fd-54c4-45bb-9b77-21b79b356aa6',
			name: 'KitKat Chunky',
			qualifier: null,
			image: 'kit-kat-chunky.svg',
			isMarketplace: false,
			count: 15,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '1eb45850-3bb1-4b66-a816-27d856f03afe',
			name: 'Mars Bar',
			qualifier: null,
			image: 'mars.svg',
			isMarketplace: false,
			count: 24,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '39a4c9f2-cde7-468f-a98b-7525ed8d1c32',
			name: 'McCoys',
			qualifier: 'Variety',
			image: 'mccoys.svg',
			isMarketplace: false,
			count: 65,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '025636ff-4088-4c53-a297-88e673b8eeaa',
			name: 'Snickers',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 40,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '106a6820-4761-4948-a7b1-0f10d270a859',
			name: 'Twix',
			qualifier: null,
			image: 'twix.svg',
			isMarketplace: false,
			count: 37,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '1230f19d-0702-49b3-9904-52864144121c',
			name: 'Yorkie Raisin Bar',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 1,
			price: {
				total: 42,
				breakdown: {
					wholesaleCost: 38,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'ecb7afbd-4272-47d0-b8d2-f5b4dbd66ed3',
			name: 'Fanta Fruit Twist Zero',
			qualifier: null,
			image: 'misc-can.svg',
			isMarketplace: false,
			count: 3,
			price: {
				total: 54,
				breakdown: {
					wholesaleCost: 49,
					serviceFee: 5,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '2c805c67-6139-4098-ba9f-7074753e1b22',
			name: '7-UP Zero',
			qualifier: null,
			image: 'misc-can.svg',
			isMarketplace: false,
			count: 8,
			price: {
				total: 54,
				breakdown: {
					wholesaleCost: 49,
					serviceFee: 5,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '3b7a6669-770c-4dbb-97e2-0e0aae3ca5ff',
			name: 'Walkers (Variety)',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: false,
			count: 70,
			price: {
				total: 25,
				breakdown: {
					wholesaleCost: 22,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'c93a8b71-2d01-4ed2-86af-695943a105e9',
			name: 'Pringles',
			qualifier: null,
			image: 'misc-crisps.svg',
			isMarketplace: true,
			count: 8,
			price: {
				total: 90,
				breakdown: {
					wholesaleCost: 81,
					serviceFee: 9,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: 'f9c8b541-0a30-4adc-8e0d-887e6db9f301'
		},
		{
			id: 'd5cdc442-0aea-40f5-965b-4c2ebe31e0cc',
			name: 'Pot Noodle',
			qualifier: 'Original Curry',
			image: 'misc-bar.svg',
			isMarketplace: true,
			count: 3,
			price: {
				total: 100,
				breakdown: {
					wholesaleCost: 90,
					serviceFee: 10,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: 'f9c8b541-0a30-4adc-8e0d-887e6db9f301'
		},
		{
			id: '73a32381-61e2-4055-a5ca-7e2475be0228',
			name: 'Pot Noodle',
			qualifier: 'Chicken & Mushroom',
			image: 'misc-bar.svg',
			isMarketplace: true,
			count: 3,
			price: {
				total: 100,
				breakdown: {
					wholesaleCost: 90,
					serviceFee: 10,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: 'f9c8b541-0a30-4adc-8e0d-887e6db9f301'
		},
		{
			id: 'a72e0e4f-7465-4b03-9b33-78a90afd4b30',
			name: 'Irn Bru',
			qualifier: null,
			image: 'misc-can.svg',
			isMarketplace: false,
			count: 9,
			price: {
				total: 40,
				breakdown: {
					wholesaleCost: 36,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'c786086f-c183-4a6a-b9a4-72d142982cff',
			name: 'Boost',
			qualifier: null,
			image: 'boost.svg',
			isMarketplace: false,
			count: 26,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '8cf7f61b-f847-48c0-bbb9-1f9e19e00b1c',
			name: 'Galaxy',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 16,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '8e9bb2db-9437-4733-acc1-f5e218e0a603',
			name: 'Fruit Pastilles',
			qualifier: null,
			image: 'fruit-pastilles-roll.svg',
			isMarketplace: false,
			count: 6,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '3ad9b71d-7627-421f-bddd-592996adbb45',
			name: 'Flake',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 31,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'e7d57402-6f60-4fb3-a585-7651cebbd4fa',
			name: 'Wispa',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 26,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '606e12d4-6367-4fc3-aa7a-92ee17ccac2c',
			name: 'Freddo',
			qualifier: null,
			image: 'freddo.svg',
			isMarketplace: false,
			count: 11,
			price: {
				total: 20,
				breakdown: {
					wholesaleCost: 18,
					serviceFee: 2,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '78816fba-150d-4282-b43d-900df45cea8b',
			name: 'Skittles',
			qualifier: null,
			image: 'skittles.svg',
			isMarketplace: false,
			count: 1,
			price: {
				total: 32,
				breakdown: {
					wholesaleCost: 29,
					serviceFee: 3,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: 'a2000689-09ef-4a1d-9569-014e156d6f59',
			name: 'Haribo',
			qualifier: null,
			image: 'misc-bag.svg',
			isMarketplace: false,
			count: 10,
			price: {
				total: 12,
				breakdown: {
					wholesaleCost: 10,
					serviceFee: 2,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		},
		{
			id: '48f0aa63-84ca-46a9-8f83-b6b40acdde79',
			name: 'Dairy Milk',
			qualifier: null,
			image: 'misc-bar.svg',
			isMarketplace: false,
			count: 24,
			price: {
				total: 35,
				breakdown: {
					wholesaleCost: 31,
					serviceFee: 4,
					donation: 0,
					handlingFee: 0,
					creditCardFee: 0,
					VAT: 0
				}
			},
			sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
		}
	].map(item => {
		const relativeImagePath = './' + item.image;

		return {
			...item,
			image: importImages(
				imgFilesObject['./' + item.image]
					? './' + item.image.endsWith('.svg')
						? './' + item.image
						: './' + item.image + '.svg'
					: './misc-bar.svg'
			)
		};
	});

	return (
		<div>
			<h3 style={{position: 'sticky', top: '0'}}>Find Thing</h3>
			<ListSelection items={items} onClick={console.log} />
		</div>
	);
};

export default test;
