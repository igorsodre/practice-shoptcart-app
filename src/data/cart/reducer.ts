import { CartActionType, ADD_TO_CART, REMOVE_FROM_CART, IAddToCartAction, IRemoveFromCartAction } from './actions';
import { CartItem } from '../../models/cart-item';
import { TReducerFunction } from '..';

export type ICartItemHolder = {
	[key in string]?: CartItem;
};
export interface ICartState {
	items: ICartItemHolder;
	totalAmount: number;
}

const initialState: ICartState = {
	items: {},
	totalAmount: 0,
};
type CartReducer = TReducerFunction<ICartState, CartActionType>;

const addToCart: CartReducer = (state, action) => {
	const newState = { ...state };
	const addedProduct = (action as IAddToCartAction).product;
	const { price: addedPrice, title } = addedProduct;

	if (newState.items[addedProduct.id]) {
		newState.items[addedProduct.id]?.icrementItem();
	} else {
		const cartItem = new CartItem(1, addedPrice, title, addedPrice);
		newState.items[addedProduct.id] = cartItem;
	}
	newState.totalAmount += addedPrice;
	return newState;
};

const removeFromCart: CartReducer = (state, action) => {
	const newState = { ...state };
	const id = (action as IRemoveFromCartAction).productId;
	if (newState.items[id]) {
		const removedPrice = newState.items[id]!.price;
		if (newState.items[id]!.quantity > 1) {
			newState.items[id]?.decrementItem();
		} else {
			delete newState.items[id];
		}
		newState.totalAmount -= removedPrice;
	}
	return newState;
};

const cartReducer: CartReducer = (state = initialState, action) => {
	try {
		switch (action.type) {
			case ADD_TO_CART:
				return addToCart(state, action);
			case REMOVE_FROM_CART:
				return removeFromCart(state, action);
			default:
				return state;
		}
	} catch (err) {
		return state;
	}
};
export default cartReducer;
