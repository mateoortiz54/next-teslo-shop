import { User } from "@/models";
import { db } from ".";
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async(email: string, password: string) => {

    await db.connect();
    const user = await User.findOne({email});
    await db.disconnect();



    if (!user) return null;

    // regresa un boolean
    if ( !bcrypt.compareSync(password, user.password!)) return null;
    

    const {role, name, _id} = user;

    return {
        id:_id,
        role, 
        name, 
        email: email.toLowerCase(),
        _id
    }
}


export const oAuthToDbUser = async(oAuthEmail:string, oAuthName: string) => {


    await db.connect();

    const user = await User.findOne({email:oAuthEmail})

    if (user) {
        db.disconnect();
        const {_id, name, role, email} = user;
        return {_id, name, role, email}
    }


    const newUser = new User({email: oAuthEmail, name: oAuthName, password: '@', role: 'client'});
    await newUser.save();
    db.disconnect(); 

    const {_id, name, role, email} = newUser;
    return {_id, name, role, email}



} 