const auth = require("../middelwares/auth");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

module.exports = function(app) {
    app.post("/register", async (req, res) => {
        try {
            const { username, email, password } = req.body;
            //console.log(nickname, email, password, phone);

            if (!(email && password && username)) {
                res.status(400).json({"response": "All input is required"});
            }

            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).json({"response": "User Already Exist. Please Login"});
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                role: "basic",
                email: email.toLowerCase(),
                password: encryptedPassword,
            });

            const token = jwt.sign(
                {
                    user_id: user._id,
                    email,
                    role: "basic"
                },
                process.env.TOKEN_KEY,
                { expiresIn: "2h", }
            );
            user.token = token;

            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    });

    app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!(email && password)) {
                res.status(400).json({"response": "All input is required"});
            }

            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                let token = null;
                if (user.role == "admin") {
                    token = jwt.sign(
                        {
                            user_id: user._id,
                            email,
                            role: "admin"
                        },
                        process.env.TOKEN_KEY,
                        { expiresIn: "2h", }
                    );
                } else {
                    token = jwt.sign(
                        {
                            user_id: user._id,
                            email,
                            role: "basic"
                        },
                        process.env.TOKEN_KEY,
                        { expiresIn: "2h", }
                    );
                }
                user.token = token;
                res.status(200).json(user);
            }
            res.status(400).json({"response": "Invalid Credentials"});
        } catch (err) {
            console.log(err);
        }
    });

    app.post("/welcome", auth, (req, res) => {
        res.status(200).json({"results": req.user});
    });
};