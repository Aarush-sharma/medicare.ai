import { NextApiResponse } from 'next'

import { NextResponse,NextRequest } from 'next/server'


export async function middleware(req: NextRequest,res:NextApiResponse) {
    if(req.nextUrl.pathname.startsWith('/ask')){
        const token = req.cookies.get("token")?.value as string
        if(token){
            return NextResponse.next()
        } else{
            return NextResponse.redirect(new URL('/sign-up', req.url))
        }
    }
    return NextResponse.next()
} 
