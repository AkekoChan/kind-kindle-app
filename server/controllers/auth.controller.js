import bcrypt from "bcryptjs";
import auth from "../helpers/authMiddleware.js";
import userModel from "../models/user.model.js";

const authController = {
  signup: async (req, res) => {
    let userdata = req.body;

    // const otpResponse = await OTPModel.find({ email: userdata.email })
    //   .sort({ createdAt: -1 })
    //   .limit(1);

    // if (otpResponse.length === 0 || userdata.otp !== otpResponse[0].otp) {
    //   return res.status(400).json({
    //     message: "Le code de validation n'est pas correct.",
    //   });
    // }

    if(!userdata.email || !String(userdata.email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      return res
      .status(401)
      .json({
        message: `E-mail invalide.`,
        error: 401
      });
    }

    userdata.password = bcrypt.hashSync(
      userdata.password,
      bcrypt.genSaltSync(11)
    );

    let new_user = new userModel(userdata);

    try {
      await new_user.save();
      let token = auth.encode({ email: new_user.email });

      return res
        .status(201)
        // .cookie("jwt", token, { httpOnly: false })
        .json({
          message: `Inscription finalisée. Bienvenue ${new_user.name} !`,
        });
    } catch (error) {
      if (error.keyValue && error.keyValue.email) {
        return res.status(409).json({
          message: `Un compte avec cet email (${error.keyValue.email}) existe déjà.`,
          error: 409,
        });
      } else if (error.keyValue && error.keyValue.name) {
        return res.status(409).json({
          message: `Un compte avec ce nom (${error.keyValue.name}) existe déjà.`,
          error: 409,
        });
      } else if (error.keyValue && error.keyValue.age) {
        return res.status(409).json({
          message: `L'âge requis pour utiliser cette application est de 13 ans.`,
          error: 409,
        });
      } else {
        return res.status(409).json({ message: error.message, error: 409 });
      }
    }
  },
  signin: async (req, res) => {
    let userdata = req.body;

    try {
      let user = await userModel.findByEmail(userdata.email);

      if (!user[0]) {
        return res
          .status(404)
          .json({ message: "E-mail ou mot de passe incorrect.", error: 404 });
      }

      user = user[0];
      const isValid = bcrypt.compareSync(userdata.password, user.password);

      if (isValid) {
        let token = auth.encode({ email: user.email });
        return res
          .status(200)
          // .cookie("jwt", token, { httpOnly: false })
          .json({ message: "Authentification réussie." });
      } else {
        return res
          .status(401)
          .json({ message: "E-mail ou mot de passe incorrect.", error: 401 });
      }
    } catch (error) {
      return res.status(404).json({ message: error.message, error: 404 });
    }
  },
};

export default authController;
