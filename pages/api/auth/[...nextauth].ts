import { dbUser } from "@/database"
import NextAuth, {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"




export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email:{label: 'Correo', type: 'email', placeholder: 'correo@google.com'},
        password: {label: 'Contraseña', type: 'password', placeholder: ''}
      },
      async authorize(credentials) {
        console.log({credentials})
        // TODO: vaildar contra la base de datos

        return await  dbUser.checkUserEmailPassword(credentials!.email, credentials!.password )

        // return {name: 'Mateo', correo: 'mateo@google.com', role: 'admin', id:'1'};
      }
    })



  ],


  // custom pages
  // url para login de custom pages
  pages:{
    signIn: '/auth/login',
    newUser: '/auth/register'
  },


  // Por defecto trabaja con jwt  
  jwt: {
  
  },


  // duration token
  session: {
    maxAge: 2592000,// 30d
    strategy: 'jwt',
    updateAge: 86400 // 24 horas, se va a actualizar
  },

  callbacks: {
    async jwt({token, account, user}){
      console.log('jwt',{token, account, user})
      if(account){
        // teoria: va a crear la propiedad si es que el account no es indefinido
        token.accessToken = account.access_token;

        switch (account.type) {
          //Red social
          case 'oauth':
            
            // TODO: crear usuario o verificar si existe
            token.user = await dbUser.oAuthToDbUser(user?.email || '', user?.name || '');
            break;


          // Custom
          case 'credentials':
            // el user viene si o si en credentials
            token.user = user;
            break;
        
          default:
            break;
        }


      }

      return token;
    },

    async session({session, token, user}){
    
      console.log('session',{session, token, user})

      session.accessToken = token.accessToken as string;
      session.user = token.user as any;


      return session;
    }

  }

  




}

export default NextAuth(authOptions)