import { useNavigate } from "react-router-dom";
import UserCartItemsContent from "@/components/Cart-Item-Content";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems = [], boxes = [] } =
    useSelector((state) => state.cart) || {};
  const { productList = [] } = useSelector((state) => state.products) || {};

  const cartTotal = cartItems.reduce((sum, item) => {
    const product = productList.find((p) => p._id === item.productId) || {};
    const variant =
      product.variants?.find(
        (v) => v.size === item.size && v.weight === item.weight
      ) || {};
    const price = variant.salesPrice || variant.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const boxesTotal = boxes.reduce((sum, box) => {
    const boxSum = (box.items || []).reduce((bSum, item) => {
      const product = productList.find((p) => p._id === item.productId) || {};
      const sizePriceObj = (product.customBoxPrices || []).find(
        (p) => p.size === item.size
      );
      const price = sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0;
      return bSum + price * (item.quantity || 1);
    }, 0);
    return sum + boxSum;
  }, 0);

  const finalAmount = cartTotal + boxesTotal;

  const isCartEmpty = cartItems.length === 0 && boxes.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 text-center sm:text-left">
        Your Cart
      </h1>

      {isCartEmpty ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl italic mb-4">
            Your cart is empty.
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
       <div className="flex flex-col lg:flex-row gap-8">
  {/* Left Column: Cart Items + Boxes */}
  <div className="flex-1 flex flex-col space-y-8">
    {/* Cart Items Section */}
    {cartItems.length > 0 && (
      <div className="flex flex-col space-y-6">
        {cartItems.map((item) => (
          <UserCartItemsContent
            key={`${item.productId}-${item.size}`}
            cartItem={item}
            className="w-full shadow-lg rounded-lg p-4 bg-white hover:shadow-xl transition-shadow"
          />
        ))}
      </div>
    )}

    {/* Boxes Section */}
    {boxes.length > 0 && (
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Your Custom Boxes
        </h2>
        {boxes.map((box) => (
          <UserCartItemsContent
            key={box.boxId}
            boxItem={box}
            className="w-full shadow-lg rounded-lg p-4 bg-indigo-50 hover:shadow-xl transition-shadow border border-indigo-100"
          />
        ))}
      </div>
    )}
  </div>

  {/* Right Column: Order Summary */}
  <div className="lg:w-96 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg sticky top-24">
    <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
    <div className="flex justify-between mb-4 text-gray-700">
      <span>Items Total</span>
      <span>₹{cartTotal.toFixed(2)}</span>
    </div>
    {boxes.length > 0 && (
      <div className="flex justify-between mb-4 text-gray-700">
        <span>Boxes Total</span>
        <span>₹{boxesTotal.toFixed(2)}</span>
      </div>
    )}
    <hr className="border-gray-200 my-4" />
    <div className="flex justify-between text-xl font-semibold text-gray-900 mb-6">
      <span>Total Amount</span>
      <span>₹{finalAmount.toFixed(2)}</span>
    </div>
    <Button
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md"
      onClick={() => navigate("/checkout")}
      disabled={isCartEmpty}
    >
      Proceed to Checkout
    </Button>
  </div>
</div>

      )}
    </div>
  );
}
