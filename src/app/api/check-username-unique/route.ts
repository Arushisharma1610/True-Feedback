// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { z } from "zod";
// import {usernameValidation} from "@/schemas/signUpSchema"

// const UsernameQuerySchema = z.object({
//     username: usernameValidation
// })

// export async function GET(request: Request){
     
//     await dbConnect()

//     try{
//         const {searchParams} = new URL(request.url)
//         const queryParam = {
//             username: searchParams.get('username')
//         }
//         // validate with zod
//         const result = UsernameQuerySchema.safeParse(queryParam)
//         console.log(result) // to be removed further
//         if(!result.success){
//             const usernameErrors = result.error.format().username?._errors || []
//             return Response.json({
//                 success: false,
//                 message : usernameErrors?.length > 0 
//                 ? usernameErrors.join(', ')
//                 : 'Invalid query parameters',
//             }, {status : 400 })
//         }

//         const {username} = result.data

//         const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

//         if(existingVerifiedUser){
//             return Response.json({
//                 success: false,
//                 message: 'Username is already taken'
//             }, {status: 400})
//         }
//         return Response.json({
//             success: true,
//             message: 'Username is valid'
//         }, {status: 400})


//     }catch(error){
//         console.error("Error checking unername" , error)
//         return Response.json(
//             {
//                 success: false,
//                 message:"Error checking username"
//             },
//             { status: 500}
//         )
//     }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        
        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); // This can be removed for production

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    success: false,
                    message: usernameErrors.length > 0 
                        ? usernameErrors.join(', ')
                        : 'Invalid query parameters',
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username is already taken'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Username is valid'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error checking username"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
