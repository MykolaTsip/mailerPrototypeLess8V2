const {userService, OAuthService, emailService} = require('../services')
const {passHesh, passCompare, tokinazer} = require('../helper')
const conf = require('../configs/constants')
const emailEnum = require('../configs/email-action.enum')

module.exports = {
    AllUsers: async (req, res) => {
        try {
            let users = await userService.allUser()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    },
    NewUser: async (req, res) => {

            let user = req.body
            user.password = await passHesh(req.body.password)
            let Newuser = await userService.newUser(user)

            await emailService.sendMail(user.email, emailEnum.WELCOME, {userName: user.email})

            res.json(Newuser)

    },
    Login: async (req, res, next) => {
        try {
            const user = req.body
            const {password} = req.user

           await  passCompare(password, user.password)
            const tokens =  tokinazer()

            OAuthService.createToken({
                ...tokens,
                user_id: req.user.id
            })

            res.json(tokens)
        } catch (e) {
            next(e)
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const user = req.user
         const oldToken = req.get(conf.AUTHORIZATION)
            const newToken =  tokinazer()

          await  OAuthService.deleteByParams({refresh_token: oldToken})

           await OAuthService.createToken({
                ...newToken,
                user_id: user.id
            })

            res.json(newToken)
        }
        catch (e) {
            next(e)
        }

    }
}
