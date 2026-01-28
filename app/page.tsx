'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from '@/components/ai-elements/attachment';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const models = [{ name: 'Google Gemini', value: 'gemini-1.5-flash' }];

const ChatBotDemo = () => {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  
  // Usamos el hook estándar
  const { messages, append, status, reload, error } = useChat({
    onError: (err) => {
      console.error("Error en el chat:", err);
      alert("Error: " + err.message);
    }
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const textToSend = input;
    if (!textToSend && !message.files?.length) return;

    append({
      role: 'user',
      content: textToSend,
      experimental_attachments: message.files,
    });
    
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    {/* LÓGICA SIMPLIFICADA: Muestra el contenido directo */}
                    <MessageResponse>
                        {message.content}
                    </MessageResponse>
                    
                    {/* Si hay partes adjuntas (imágenes, etc), intentar mostrarlas solo si existen */}
                    {message.experimental_attachments && (
                        <div className="text-xs text-muted-foreground mt-1">
                            {message.experimental_attachments.length} archivo(s) adjunto(s)
                        </div>
                    )}
                  </MessageContent>

                  {message.role === 'assistant' && (
                    <MessageActions>
                      <MessageAction onClick={() => reload()} label="Retry">
                        <RefreshCcwIcon className="size-3" />
                      </MessageAction>
                      <MessageAction onClick={() => navigator.clipboard.writeText(message.content)} label="Copy">
                        <CopyIcon className="size-3" />
                      </MessageAction>
                    </MessageActions>
                  )}
                </Message>
              </div>
            ))}
            
            {/* Si hay un error, lo mostramos en rojo */}
            {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">Error:</span> {error.message}
                </div>
            )}

            {status === 'submitted' || status === 'streaming' ? <Loader /> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Escribe algo a Gemini..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton variant={'ghost'}>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect onValueChange={setModel} value={model}>
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((m) => (
                    <PromptInputSelectItem key={m.value} value={m.value}>
                      {m.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && status !== 'streaming'} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;