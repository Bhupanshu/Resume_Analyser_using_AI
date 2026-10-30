import React from 'react'
import { useState,useRef } from 'react'
import { useInterview } from '../hook/useinterview'
import { useNavigate } from 'react-router';

const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobdescription, setJobdescription] = useState("");
  const [selfdescription, setSelfdescription] = useState("");
  const resumeinputRef = useRef();
  const navigate = useNavigate();

  const handleInterviewreport= async (e)=>{
    e.preventDefault(); 
    const resume = resumeinputRef.current.files[0];
    if (!resume) return alert("Please upload your resume");

    const report = await generateReport({ jobdescription, selfdescription, resume });
    if (report) navigate(`/interview/${report._id}`); 
  }

  if(loading){
        return (
            <main className="min-h-screen flex justify-center items-center ">
                Loading ... 
            </main>
        )
    }   


  

  return (
    <main className='w-full min-h-screen flex justify-center items-center bg-gray-200 px-4 py-10'>
      <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-10 md:p-12 w-full max-w-3xl'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-3'>Check Your Compatibility For The Job</h1>
        <p className='text-sm leading-relaxed text-center text-gray-500 mb-10'>Paste a job description, upload your resume, and describe yourself to get started.</p>

        <form className='flex flex-col gap-8' onSubmit={handleInterviewreport}>
          <div className='flex flex-col gap-2'>
            <label htmlFor="jobDescription" className='text-sm font-medium text-gray-600'>Job Description</label>
            <textarea
              onChange={(e) => setJobdescription(e.target.value)}
              name="jobDescription"
              id="jobDescription"
              rows="6"
              placeholder="Paste the job description here..."
              className='border border-gray-300 rounded-lg px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition resize-none bg-gray-50'
            ></textarea>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="resume" className='text-sm font-medium text-gray-600'>Upload Resume</label>
              <label
                htmlFor="resume"
                className='flex flex-1 flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition text-center'
              >
                <span className='text-2xl mb-2'>📄</span>
                <span className='text-sm text-gray-500'>Click to upload PDF</span>
                <input ref={resumeinputRef} type="file" accept='.pdf' name='resume' id='resume' className='hidden' />
              </label>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="selfDescription" className='text-sm font-medium text-gray-600'>Self Description</label>
              <textarea
                onChange={(e) => setSelfdescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                rows="6"
                placeholder="Briefly describe your experience and strengths..."
                className='border border-gray-300 rounded-lg px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition resize-none bg-gray-50 h-full'
              ></textarea>
            </div>
          </div>

          <div className='flex justify-center pt-2'>
            <button
              type="submit"
              className='w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-150 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5'
            >
              Analyze &amp; Prepare
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Home;