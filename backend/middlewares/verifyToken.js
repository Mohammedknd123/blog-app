const jwt = require('jsonwebtoken')

// Verify Token
function verifyToken (req, res, next) {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decodedPayload
            next()
        } catch (error) {
            return res
              .status(401)
              .json({ message: "invalid token , access denied" });
        }
    }else {
        return res.status(401).json({message: "no token provided , access denied"})
    }
}

// Verify Token & Admin
function verifyTokenandAdmin (req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        }else {
            return res
              .status(403)
              .json({ message: "you are not allowed , only admin" });
        }
    })
}

// Verify Token & only user himself
function verifyTokenandOnlyUser (req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next()
        }else {
            return res
              .status(403)
              .json({ message: "you are not allowed , only user himself" });
        }
    })
}

// Verify Token & Authorization
function verifyTokenandAuthorization (req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        }else {
            return res
              .status(403)
              .json({ message: "you are not allowed , only user himself or Admin" });
        }
    })
}

module.exports = {
  verifyToken,
  verifyTokenandAdmin,
  verifyTokenandOnlyUser,
  verifyTokenandAuthorization
};