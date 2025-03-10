import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auths'
import { z } from 'zod'
import Comment from '@/app/lib/database/schemas/comment'
import { commentDTO } from '../(dtos)/comment.dto'
import { checkFileType } from '@/app/lib/utils/checks'


export async function updateCommentService(commentId: string, req: NextRequest)
{
  try 
  {
    const userId = await parseAuth(req)
    if(userId.status === 401) return userId

    const body = await req.json()
    
    if (!body || body.comment.trim().length === 0 && body.mediaUrl.trim().length === 0) 
    {
      return NextResponse.json(
      { message: 'Update comment canceled: empty content' },
      { status: 204 })
    }

    commentDTO.parse(body)
    
    await connectToDB()
    const updatedComment = await Comment.findOneAndUpdate(
    {_id: commentId, userId: userId},
    { $set:
      {
          text: body.text,
          file:
          {
              url: body.fileUrl,
              type: checkFileType(body.fileUrl)
          },
          edited: true
      }
    },
    { new: true })

    if(!updatedComment)
    {
      return NextResponse.json(
      { message: 'Comment not found or user not is author' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'Comment updated successfully', comment: updatedComment }, 
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
      console.error('\u{274C} Internal server error while updating comment: ', error)
      return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 })
    }  
  }
}
