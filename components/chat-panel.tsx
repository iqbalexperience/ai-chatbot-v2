import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconPlus, IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [chatbotSelect, setChatbotSelect] = React.useState('gpt-3.5-turbo-1106')
  const router = useRouter()
  const exampleMessages = [
    {
      heading: 'What are the',
      subheading: 'trending memecoins today?',
      message: `What are the trending memecoins today?`
    },
    {
      heading: 'What is the price of',
      subheading: '$DOGE right now?',
      message: 'What is the price of $DOGE right now?'
    },
    {
      heading: 'I would like to buy',
      subheading: '42 $DOGE',
      message: `I would like to buy 42 $DOGE`
    },
    {
      heading: 'What are some',
      subheading: `recent events about $DOGE?`,
      message: `What are some recent events about $DOGE?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {/* <div className="mb-2 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message,
                    chatbotSelect
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div> */}

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col">
          <div className="mb-2 flex flex-row space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex size-8 rounded p-0 border"
                  onClick={() => {
                    router.push('/new')
                  }}
                >
                  <IconPlus />
                  <span className="sr-only">New Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
            <Select value={chatbotSelect} onValueChange={setChatbotSelect}>
              <SelectTrigger className="w-fit h-8 bg-background">
                <SelectValue placeholder="Chatbot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo-1106">
                  GPT 3.5 Turbo (OpenAI)
                </SelectItem>
                <SelectItem value="gpt-4-1106-preview">
                  GPT 4 (OpenAI)
                </SelectItem>
                <SelectItem value="llama3-8b-8192">
                  Llama 3 - 8b (Groq)
                </SelectItem>
                <SelectItem value="llama3-70b-8192">
                  Llama 3 - 70b (Groq)
                </SelectItem>
                <SelectItem value="gemma-7b-it">Gemma - 7b (Groq)</SelectItem>
                <SelectItem value="mixtral-8x7b-32768">
                  Mixtral - 8x7b (Groq)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PromptForm
            input={input}
            setInput={setInput}
            chatbotSelect={chatbotSelect}
          />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  )
}
