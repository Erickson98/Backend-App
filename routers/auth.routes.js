const { Router } = require("express");
const passport = require("passport");
const router = Router();
const {
  logout,
  loginFailed,
  getToken,
  checkRefreshToken,
  checkAccesToken,
  searchDataBase,
  checkAdmin,
  credentials,
} = require("../controllers/auth.controllers.js");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/success", searchDataBase);
router.get("/logout", logout);

router.get("/login/failed", loginFailed);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://shiny-tanuki-6e7bda.netlify.app/ViewElement",
    failureRedirect: "/login/failed",
  }),
  async (req, res) => {
    res.status(204).json({
      success: true,
      message: "successfull",
    });
  }
);
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "https://shiny-tanuki-6e7bda.netlify.app/ViewElement",
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res.status(204).json({
      success: true,
      message: "successfull",
    });
  }
);
router.get("/checkAutherization", checkRefreshToken, checkAccesToken);
router.get("/getToken", getToken);
router.get("/deleteCookies", logout);
router.get("/checkCredentials", credentials); //here
router.get("/checkAdmin", checkRefreshToken, checkAccesToken, checkAdmin);
module.exports = router;
