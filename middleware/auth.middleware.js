import jwt from "jsonwebtoken"
import { db } from "../db/index.js"
import { users } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Missing token" })
    }

    const token = authHeader.split(" ")[1];

    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))

        const user = result[0];

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid token" });
        }

        req.user = { id: user.id, username: user.username };

        next()

    } catch (error) {
        console.error(error);
        return res
        .status(401)
        .json({ message: "Error while authenticating or invalid token" });
    }

}