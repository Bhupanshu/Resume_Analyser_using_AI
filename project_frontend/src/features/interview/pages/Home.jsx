import { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hook/useinterview'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../auth/hook/useAuth';  
import Logo from '../../auth/component/Logo' ; 


const scoreStyle = (score) =>
  score >= 75
    ? 'bg-green-100 text-green-700'
    : score >= 50
    ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const Home = () => {
  const { loading, generateReport, reports, getReports,deleteReport } = useInterview();
  const [jobdescription, setJobdescription] = useState("");
  const [selfdescription, setSelfdescription] = useState("");
  const resumeinputRef = useRef();
  const navigate = useNavigate();

  const {handlelogout}=useAuth();

  const onLogout = async()=>{
    await handlelogout();

    navigate("/login")
  }


  const handleDelete = async (id) => {
  if (!window.confirm('Delete this report? This cannot be undone.')) return;
  const ok = await deleteReport(id);
  if (!ok) alert('Could not delete the report. Please try again.');
};



  // Load the user's previous reports once when the page opens
  useEffect(() => {
    getReports();
  }, []);

  const handleInterviewreport = async (e) => {
    e.preventDefault();
    const resume = resumeinputRef.current.files[0];
    if (!resume) return alert("Please upload your resume");

    const report = await generateReport({ jobdescription, selfdescription, resume });
    if (report) navigate(`/interview/${report._id}`);
  }

  const list = Array.isArray(reports) ? reports : [];

  return (
    <main className='w-full min-h-screen flex flex-col items-center gap-8 bg-gray-200 px-4 py-10'>

      <Logo size='lg'/>

      <div className='w-full max-w-3xl flex justify-end'>
      <div className='w-full max-w-3xl flex justify-end'>
        <button
        type='button'
        onClick={onLogout}
        className='text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer'>
          Log out
          </button>
      </div>
      </div>   


      <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-10 md:p-12 w-full max-w-3xl'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-3'>Check Your Compatibility For The Job</h1>
        <p className='text-sm leading-relaxed text-center text-gray-500 mb-10'>Paste a job description, upload your resume, and describe yourself to get started.</p>

        <form className='flex flex-col gap-8' onSubmit={handleInterviewreport}>
          <div className='flex flex-col gap-2'>
            <label htmlFor="jobDescription" className='text-sm font-medium text-gray-600'>Job Description</label>
            <textarea
              value={jobdescription}
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
                value={selfdescription}
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
              disabled={loading}
              className='w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-150 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'
            >
              {loading ? 'Analyzing...' : 'Analyze & Prepare'}
            </button>
          </div>
        </form>
      </div>

      {/* Previous reports */}
      <section className='bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-3xl'>
        <h2 className='text-xl font-bold text-gray-800 mb-6'>Your Previous Reports</h2>

        {list.length === 0 ? (
          <p className='text-sm text-gray-500 text-center py-6'>
            No reports yet. Your analyses will appear here.
          </p>
        ) : (
          <ul className='flex flex-col gap-3'>
           {list.map((r) => (
  <li key={r._id} className='flex items-center gap-3'>
    <Link
      to={`/interview/${r._id}`}
      className='flex flex-1 min-w-0 items-center justify-between gap-4 border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-400 hover:bg-blue-50 transition'
    >
      <div className='min-w-0'>
        <p className='font-semibold text-gray-800 truncate'>{r.title || 'Interview analysis'}</p>
        <p className='text-sm text-gray-500 mt-0.5'>{formatDate(r.createdAt)}</p>
      </div>
      <span className={`shrink-0 text-sm font-semibold px-3 py-1 rounded-full ${scoreStyle(r.matchscore)}`}>
        {r.matchscore ?? 0}%
      </span>
    </Link>
    <button
      type='button'
      onClick={() => handleDelete(r._id)}
      aria-label='Delete report'
      className='shrink-0 text-sm font-medium text-red-600 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition cursor-pointer'
    >
      Delete
    </button>
  </li>
))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Home;
