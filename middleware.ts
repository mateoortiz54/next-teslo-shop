import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";



export async function middleware(req:NextRequest) {

    const session: any = await getToken({req, secret:process.env.NEXTAUTH_SECRET})
    
    // console.log('El role del cliente es el siguiente: ', {sessionRole: session.user.role})
    const validRolesAdmin = ['admin', 'super-user', 'SEO']
    const ApiPagePostsAdmin = ['/api/admin/dashboard', '/api/admin/users'] 
    const ApiPagesAdmin = ['/admin', '/admin/users'] 
    //! Valildacion Para Apis desde Postman
    if (ApiPagePostsAdmin.includes(req.nextUrl.pathname)){
        if (!session) {
            
            return new Response(JSON.stringify({message: 'No autorizado'}), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
                
            })
        }
        
        if (!validRolesAdmin.includes(session.user.role)) {
            return new Response(JSON.stringify({message: 'No autorizado'}), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
                
            })
        }

    }
    //! Si no es desde postamn
    console.log('Esto es la session desde los middleware:', {session})

    if (!session) {

        const requestPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestPage}`
        return NextResponse.redirect(url)
    }

    //! Páginas solo para admin
    
    if (ApiPagesAdmin.includes(req.nextUrl.pathname) && !validRolesAdmin.includes(session.user.role)) {
        const url = req.nextUrl.clone();
        url.pathname = `/`;
        return NextResponse.redirect(url)

    }

    console.log('Esta pasando el middlaware correctamente')
    return NextResponse.next();
    // return NextResponse.redirect(new URL('/about2', req.url))
}


export const config = {
    matcher: [
        // Pages
        '/checkout/address',
        '/checkout/summary',
        '/admin',
        '/admin/users',

        //EndPoints 
        '/api/admin/dashboard',
        '/api/admin/users'
    ]
}