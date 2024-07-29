import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}


// import UserModel from '@/models/User';
// import dbConnect from '@/lib/dbConnect';
// import { Message } from '@/models/User';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   console.log("Received request to send message"); // Debug log
//   await dbConnect();
//   const { username, content } = await request.json();

//   try {
//     const user = await UserModel.findOne({ username }).exec();
//     console.log("User found:", user); // Debug log

//     if (!user) {
//       console.log("User not found"); // Debug log
//       return NextResponse.json(
//         { message: 'User not found', success: false },
//         { status: 404 }
//       );
//     }

//     // Check if the user is accepting messages
//     if (!user.isAcceptingMessage) {
//       console.log("User is not accepting messages"); // Debug log
//       return NextResponse.json(
//         { message: 'User is not accepting messages', success: false },
//         { status: 403 }
//       );
//     }

//     const newMessage = { content, createdAt: new Date() };

//     // Push the new message to the user's messages array
//     user.messages.push(newMessage as Message);
//     await user.save();

//     console.log("Message sent successfully"); // Debug log
//     return NextResponse.json(
//       { message: 'Message sent successfully', success: true },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error adding message:', error); // Debug log
//     return NextResponse.json(
//       { message: 'Internal server error', success: false },
//       { status: 500 }
//     );
//   }
// }
