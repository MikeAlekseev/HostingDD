import bcrypt from 'bcrypt'

export const comparePassAndPassHash = (password: string, passHash: string): Promise<boolean> => {
    return bcrypt.compare(password, passHash)
}

export const generatePassHash = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
}
