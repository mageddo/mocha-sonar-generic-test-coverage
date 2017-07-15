var assert = require("assert")
var basketClazz = require("../src/FruitsBasket")

describe('Fruit Basket', function(){

	describe('Add Items To Fruits Basket', function(){
		
		it('3 Fruits in Basket Success', function(){
			var basket = basketClazz.newBask();

			basket.push('Apple');
			basket.push('Orange');
			basket.push('Grape');

			assert.deepEqual(basket, ['Apple', 'Orange', 'Grape']);
		});

		it('4 Fruits in Basket Error', function(){
			var basket = basketClazz.newBask()

			basket.push('Apple');
			basket.push('Orange');
			basket.push('Grape');
			basket.push('Tomato');

			assert.deepEqual(basket, ['Apple', 'Orange', 'Grape']);
		});

	});

});