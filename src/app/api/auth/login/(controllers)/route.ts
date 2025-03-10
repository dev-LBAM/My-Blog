import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { loginUserService } from "../(services)/login-user.service"
import { loginUserDTO } from "../(dtos)/login-user.dto"


export async function POST( req: NextRequest )
{
    try 
    {
        const body = await req.json()

        const validatedData = loginUserDTO.parse(body)

        const response = await loginUserService(validatedData)

        if (!response) 
        {
            return NextResponse.json(
            { message: 'User not found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'User logged successfully', User: response }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        if (error instanceof z.ZodError)
        {
            return NextResponse.json(
            { message: 'Validation error', details: error.errors }, 
            { status: 400 })                 
        } 
        else 
        {
            console.error('\u{274C} Internal server error while logging user: ', error)
            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}