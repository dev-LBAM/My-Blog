
import { NextRequest} from 'next/server'
import { getUserPublicService } from '../../(services)/get-public.service'

export async function GET(req: NextRequest) /* GET PUBLIC DATA OF USER */
{
    const userId = req.nextUrl.pathname.split('/')[3]

    const response = await getUserPublicService(userId) 
    return response
}