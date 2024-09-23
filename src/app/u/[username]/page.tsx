/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MessagesSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useParams } from 'next/navigation';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function messagePage(){
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const defaultMessages : Array<string> = ["What's one hidden talent you have that most people wouldn't guess?", 'If you could travel anywhere in the world right now, where would you go and why?', "What's the most interesting thing you've learned recently? '"]
  const [getSuggestions, setGetSuggestions] = useState<Array<string>>(defaultMessages);

  const {username} = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof MessagesSchema>>({
    resolver : zodResolver(MessagesSchema),
    defaultValues : {
      content : "",
    }
  })
  const {watch, setValue} = form;
  const message = watch('content');
  
  
  const {toast} = useToast();
  const onSubmit = async (data: z.infer<typeof MessagesSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {username : username, content : data.content});
      toast({
        title: 'Success',
        description: response.data.message,
        className: 'text-black',
      });
      setValue("content", "")
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError.response?.data.message;
      ('There was a problem sending message. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
    }finally{
      setIsLoading(false);
    }
  }
  const handleSuggestMessages = async () => {
    try {
      setSuggestionsLoading(true);
      // const response = await axios.get<ApiResponse>("/api/suggest-messages");
      const response = await axios.get<ApiResponse>("/api/suggest-messages", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const splitMessages : Array<string> = response.data.message[0].split("||");
      
      setGetSuggestions(splitMessages);
      console.log(splitMessages);
      console.log(response);
      console.log(getSuggestions);

    } catch (error) {
      console.log(error);
    }finally{
      setSuggestionsLoading(false);
    }
  }

  return (
    <div className='flex items-center p-5 pt-10 w-full justify-center flex-col text-black'>
      <h1 className='text-4xl font-bold text-black'>Public Profile Link</h1>
      <div className='flex w-3/5 flex-col p-5 m-5 items-start justify-start'>
      <p>Send Anonymous Message to @{username}</p>
      <Form {...form}>
        <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
        name = "content"
        control={form.control}
        render={({field}) => (
          <FormItem >
              <textarea className='w-full rounded-md p-2 my-2 border-2 border-gray-300 focus:ring-black outline-none focus:border-black focus:ring-0 min-h-20 max-h-20' {...field} name="content" placeholder='Write your anonymous message here' />
              <FormMessage/>
          </FormItem>
        )}
        />
        <div className='text-center m-2'>
        <Button disabled = {isLoading || !message} type='submit' className='text-white my-1'>
          {
            isLoading ? <Loader2/> : "send it"
          }
        </Button>
        </div>
        </form>
      </Form>
      </div>
      <div className='flex flex-col items-start justify-start py-5 w-3/5'>
        <Button onClick={handleSuggestMessages}>
          Suggest Messages
        </Button>
        <p className='my-5'>Click on any message below to select it.</p>

        <Card className='w-full border-gray-400 p-1 border'>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          {getSuggestions.map((item, index) => (
            <CardContent key={index} className='border p-2 m-1 my-5 rounded-sm text-center cursor-pointer border-gray-300' onClick={() => setValue("content", item)}>
              {suggestionsLoading ? "" : item}
            </CardContent>
          ))}
      </Card>
      <div className='w-full text-center  my-5 text-lg'>
      <p>Get your messages Board</p>
      <Button onClick={() => {router.replace('/')}} className='my-4'>Create Your Account</Button>
      </div>

      </div>
    </div>
  )
};
// export default messagePage
