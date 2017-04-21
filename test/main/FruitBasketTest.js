var assert = require("assert")

describe('Fruit Basket', function(){

	describe('Add Items To Fruits Basket', function(){
		
	  it('3 Fruits in Basket', function(){
	  	var basket = [];

	  	basket.push('Apple');
	  	basket.push('Orange');
	  	basket.push('Grape');

	    assert.deepEqual(basket, ['Apple', 'Orange', 'Grape']);
	  });
	});

});