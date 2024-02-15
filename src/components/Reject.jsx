import React from 'react'
import { Link } from 'react-router-dom'

const Reject = () => {
    return (
        <div className='text-white flex justify-center '>
            <div className='my-[200px]  w-fit '>
                <strong className='text-4xl '>Oops! the provided image is not correct</strong>
                <div className='flex justify-evenly my-20'>
                    <div className='bg-blue-600 p-2 rounded-lg'>
                        <Link to="/scan">Scan Again!</Link>
                    </div>
                    <div className='bg-blue-600 p-2 rounded-lg'>
                        <Link to="/">Homepage</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reject