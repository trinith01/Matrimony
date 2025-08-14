const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your payment has been processed successfully.</p>
        <a
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
