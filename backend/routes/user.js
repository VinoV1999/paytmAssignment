const express = require("express");
const { signUpSchema, signInSchema, updateSchema } = require("./../types");
const { User, Account } = require("../mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleWare } = require("../middlewares/authMiddleWare");

const router = express.Router();

router.post("/signUp", async (req, res) => {
  const { success } = signUpSchema.safeParse(req.body);
  if (!success)
    return res.status(411).json({
      message: "incorrect Input!",
    });

  const { firstName, lastName, email, password } = req.body;
  const existingUser = User.findOne({
    email: req.body.email,
  });
  if (existingUser)
    return res.status(411).json({
      message: "User already signed up!",
    });

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  })

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signIn", async (req, res) => {
  const { success } = signInSchema.safeParse(req.body);

  if (!success)
    return res.status(411).json({
      message: "incorrect Input!",
    });

  const { email, password } = req.body;

  const user = User.findOne({
    email,
    password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }
});

router.put("/update", authMiddleWare, async(req, res) => {
    const { success } = updateSchema.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
