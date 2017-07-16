var assert = require("assert")
var basketClazz = require("../../main/js/FruitsBasket")

describe('Fruit Basket', function(){

	describe('Add Items To Fruits Basket', function(){
		
		it('3 Fruits in Basket Success', function(){
			var basket = basketClazz.newBasket();

			basket.push('Apple');
			basket.push('Orange');
			basket.push('Grape');

			assert.deepEqual(basket, ['Apple', 'Orange', 'Grape']);
		});

		it('4 Fruits in Basket Error', function(){
			var basket = basketClazz.newBasket()

			basket.push('Apple');
			basket.push('Orange');
			basket.push('Grape');
			basket.push('Tomato');

			assert.deepEqual(basket, ['Apple', 'Orange', 'Grape']);
		});

	});

});