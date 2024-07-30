import axios from 'axios'

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const sendMessage = async (msg: string) => {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: msg
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return res.data.choices[0].message.content
  } catch (error) {
    console.error(`Error sending message: ${error}`)
    return 'Something went wrong'
  }
}
