import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const auth = {
  encode: (data) => {
    // data.expiration = new Date().getTime() + (1209600 * 1000);
    return jwt.sign(data, process.env.PRIVATE, { expiresIn: 1209600 });
  },
  require: async (req, res, next) => {
    try {
      if (!req.headers.authorization)
        throw {
          code: 400,
          message:
            "Echec d'authentification, le header authorisation est manquant.",
        };

      let userdata = jwt.verify(
        req.headers.authorization.replace("Bearer ", ""),
        process.env.PRIVATE
      );
      let user = await userModel.findByEmail(userdata.email);

      // let tdate = new Date();

      if (!user[0])
        throw {
          code: 404,
          message:
            "Echec d'authentification, l'utilisateur du jeton n'existe pas.",
        };
      if (userdata.password !== user[0].password)
        throw {
          code: 401,
          message: "Echec d'authentification, mot de passe de jeton incorrect.",
        };
      // if(userdata.expiration < tdate.getTime()) throw { code: 401, expires: true, message: 'Echec d\'authentification, le jeton d\'authentification a expiré.' }

      // tdate.setTime(userdata.expiration);

      // res.set('Expires', tdate.toUTCString());
      res.locals.user = user[0];
      return next();
    } catch (error) {
      return res
        .status(error.code ?? 401)
        .json({ message: error.message, error: error.code ?? 401 });
    }
  },
  verify: (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Echec d'authentification." });
    }
    jwt.verify(token, process.env.PRIVATE, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Echec d'authentification." });
      } else {
        const user = userModel.findByEmail(decoded.email);

        if (!user) {
          return res.status(401).json({ message: "Echec d'authentification." });
        }

        return res.status(200).json({ message: "Authentification reussie." });
      }
    });
  },
};

export default auth;
