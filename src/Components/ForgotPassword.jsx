import React,{useState} from 'react'
export default function ForgotPassword({onClose,onCancel}) {

    // State to manage the email input field
    const [email, setEmail] = useState('');

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-sm p-10">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-sm "></div>
      
      {/* Popover content */}
      <div className="relative bg-white flex flex-col justify-center items-center space-y-5 w-96 h-56 shadow-md  ml-20 z-10 p-10 rounded-sm">
        <h1 className="text-xl mt-2 font-normal text-black">Forgot Password</h1>
        <p className="text-sm font-normal text-black">Enter your email address to reset your password</p>

        {/* Email input field */}
        <input className='border border-gray-300 rounded-sm p-2 w-80' type="email" placeholder='Email Address' value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-center items-center space-x-4 w-80">
            <button 
              className="bg-red-500 hover:bg-red-700 w-28 text-white font-bold py-2 px-4 rounded-sm shadow-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button 
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm shadow-gray-400"
              onClick={()=>onClose(email)}
            >
              Send Email
            </button>
        </div>
      </div>
    </div>
  )
}
