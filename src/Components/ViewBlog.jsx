import React from 'react'

export default function ViewBlog({url,author,title,content,date,status,visibility}) {
  return (
    <div class="w-full ">
        <div class="flex items-center">
            <div>
                <img src={url} alt="blog" class="h-96 w-[50%] object-cover"/>
            </div>
            <div class="flex flex-col space-y-2 space-x-2 items-center ">
                <p class="text-sm text-gray-400">{title}</p>
                <p class="text-sm text-gray-400">{author}</p>
                <p class="text-sm text-gray-400">{date}</p>
                <p class="text-sm text-gray-400 p-1 border border-spacing-1 rounded-full">{visibility}</p>
                <p class="text-sm text-gray-400 p-1 border border-spacing-1 rounded-full">{status}</p>
                <div></div>
            </div>
        </div>
    </div>
  )
}
