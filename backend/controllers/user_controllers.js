import User from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import UserBoost from "../models/userBoost.js";
import Plan from "../models/plans.js";
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";

const getUserWithBoostStatus = async (user) => {
  try {
    const now = new Date();
    const activeBoost = await UserBoost.findOne({
      user: user._id,
      boost_start_date: { $lte: now },
      boost_end_date: { $gte: now },
    });

    return {
      ...user.toObject(),
      boosted: !!activeBoost, // Add boosted status dynamically
    };
  } catch (error) {
    throw new Error("Error while fetching boost status: " + error.message);
  }
};

const getSortedUsers = async (req, res) => {
  try {
    // Fetch users with their subscription plans, sorted by creation date first (to avoid re-querying)
    const users = await User.find({ account_status: "active" })
      .populate("subscription_plan")
      .exec();
    //above User is printed

    // Process each user to add their boost status
    const usersWithBoostStatus = await Promise.all(
      users.map((user) => getUserWithBoostStatus(user))
    );

    // Separate users by their subscription plans and boost status
    const vipBoostedUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "VIP" && user.boosted
    );
    const vipNormalUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "VIP" && !user.boosted
    );
    const premiumBoostedUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "Premium" && user.boosted
    );
    const premiumNormalUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "Premium" && !user.boosted
    );
    const basicUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "Basic"
    );
    const freeUsers = usersWithBoostStatus.filter(
      (user) => user.subscription_plan && user.subscription_plan.name === "Free"
    );

    // Combine all the users into one array, following the required order
    const sortedUsers = [
      ...vipBoostedUsers,
      ...vipNormalUsers,
      ...premiumBoostedUsers,
      ...premiumNormalUsers,
      ...basicUsers,
      ...freeUsers,
    ];

    // Send the sorted users as a response
    res.json({ success: true, data: sortedUsers });
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
    });
  }
};

export default getSortedUsers;

export const getUserWithId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id)
      .populate("subscription_plan")
      .populate({
        path: "contacts",
        select: "name email phone profile_photo", // Select only the required fields
      });

    res.send(user);

    // const user = User.findById(id);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user",
    });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Use 587 for TLS
    secure: false, // true for 465, false for other ports
    auth: {
      user: "gt202054194@gmail.com", // Your email address
      pass: "goyfolybjeujhrht",
    },
  });

  const mailOptions = {
    from: "gt202054194@gmail.com", // Sender address
    to: email, // Recipient email
    subject: "Your OTP for Registration", // Subject line
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`, // Plain text body
  };

  const res = await transporter.sendMail(mailOptions);
  console.log("Email sent: ", res);
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const { email } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Email ${email} already in use. Please choose another.`,
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await OTP.create({ email, otp, expiresAt });
    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, userData } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    await OTP.deleteOne({ email, otp });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const {
      name,
      phone,
      password,
      gender,
      religion,
      caste,
      mother_tongue,
      occupation,
      education,
      income,
      location: { city, country },
      birthday,
    } = userData;

    const password_hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password_hash,
      gender,
      religion,
      caste,
      subscription_plan: "67cf3339fd0946d5a7299f10",
      mother_tongue,
      occupation,
      education,
      income,
      location: { city, country },
      birthday: new Date(birthday),
      profile_photo:
        "https://i.ibb.co/PG7QS263/dummy-profile-pic-300x300-1-180x180.png",
      
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "OTP verified successfully. User created.",
      data: user,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying the OTP.",
    });
  }
};

export const updateUserProfileView = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.profile_views_today = user.profile_views_today + 1;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User profile view updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user profile view",
    });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, req.body, { new: true });
    res.send({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user.",
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting user.",
    });
  }
};
