import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { inputChecker } from "@/lib/types"; 
import { ADMIN_JWT_SECRET } from "../post/route"; // change this with env
import * as jwt from "jsonwebtoken"

//set loged when error comes return something add ur logic
export async function GET(req:NextRequest){
    
    const data = new URL(req.url)
    const email =  data.searchParams.get("email") as string;
    const password = data.searchParams.get("password") as string;
    
    const validData = await inputChecker({email}); 
    const token = req.cookies.get("token")?.value as string
    if(validData){
    try{
      const user = await prisma.user.findFirst({
        where: {
          email:email,
          password:password
        },select:{
            email:true,
            username:true,
            password:true
        }
      });        
      console.log("user is ",user);
      if(token&&user){
        jwt.verify(token,ADMIN_JWT_SECRET);
     }else if(!token&&user){
      const res = NextResponse.json({msg:"loged in succesfully"})
      const newtoken = jwt.sign({email,password},ADMIN_JWT_SECRET)
      res.cookies.set({
        name:"token",
        value:newtoken,
        maxAge: 60*60*24*7,
        httpOnly:true
      })
      return res;
      }   else{
        return NextResponse.json({msg:"user not found"})
      } 
     return NextResponse.json({msg:"loged in succesfully"})
                       
    }catch(Err){
    return NextResponse.json({msg:"incorrect pass or user not found"})
    }
  }else{ 
  return NextResponse.json({msg:"invalid input type"})
  }
}
/* const {email}:{email:string}=await res.json()
    const resp = NextResponse.json({msg:"hallo"});
    resp.cookies.set({
        name:"token",
        value:email,
        maxAge: 60*60*24*7,
        httpOnly:true
    })
    const token = res.cookies.get("token")?.value
    console.log(token)
return resp; */