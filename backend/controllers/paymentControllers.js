import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generatePaymentData = (req, res) => {
  try {
    const { requesterId, receiverId } = req.body;
    console.log("requesterId", requesterId);
    console.log("receiverId", receiverId);

    const data = {
      access_key: process.env.CYBERSOURCE_ACCESS_KEY,
      profile_id: process.env.CYBERSOURCE_PROFILE_ID,
      transaction_uuid: crypto.randomUUID(),
      signed_field_names: 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,amount,currency,locale,transaction_type,signed_date_time,return_url,reference_number,bill_address1,bill_city,bill_country',
      unsigned_field_names: '',
      amount: "1.00",
      currency: "USD",
      locale: "en",
      transaction_type: "sale",
      signed_date_time: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      return_url: `https://yellow-breads-fail.loca.lt/payment-success`,
      reference_number: crypto.randomUUID(),
      bill_address1: "123 Main Street",
      bill_city: "Colombo",
      bill_country: "LK" // Sri Lanka (change to your case)
    };

    console.log("Request Data to Sign:", data);

    const signature = generateSignature(data, process.env.CYBERSOURCE_SECRET_KEY);

    console.log("Generated Signature:", signature);

    data.signature = signature;
    console.log("Final Payment Data Sent to Frontend:", data);

    res.json(data);

  } catch (error) {
    console.error("Error generating payment data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function generateSignature(params, secretKey) {
  const signedFieldNames = params.signed_field_names.split(',');
  const dataToSign = signedFieldNames.map(key => `${key}=${params[key]}`).join(',');
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}
