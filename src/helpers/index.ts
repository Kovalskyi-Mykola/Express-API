
import crypto from "crypto"

const SECRET = "53mpMCb1nK"

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, passsword: string) => {
    return crypto.createHmac('sha256', [salt, passsword].join('/')).update(SECRET).digest('hex');
}