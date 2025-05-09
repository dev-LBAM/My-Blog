export default function getErrorMessage(error: unknown) : string 
{
    if(error instanceof Error) return error.message
    return 'An unexpected error occurred'
  }
  