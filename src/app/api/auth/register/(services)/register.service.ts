import User from '@/app/lib/database/schemas/user'
import { RegisterUserDTO } from '../(dtos)/register.dto'
import { connectToDB } from '@/app/lib/database/mongodb'
import { hashPassword } from '@/app/lib/utils/auths'

export async function registerUserService(validatedData: RegisterUserDTO)
{
    await connectToDB()
    const birthDate = new Date(validatedData.birthDate)
    
    const hashPass= await hashPassword(validatedData.password)
    const newUser = new User({
        ...validatedData,
        password: hashPass,
        birthDate: birthDate,
        profileImg: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    })
    
    const registeredData = await newUser.save()

    return registeredData
}
