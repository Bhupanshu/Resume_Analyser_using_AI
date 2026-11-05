export const APP_NAME = 'HireReady'

const Logo = ({ size = 'md', showName = true }) => {
  const icon = size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'
  const text = size === 'lg' ? 'text-3xl' : 'text-xl'

  return (
    <div className='flex items-center gap-2.5'>
      <svg viewBox='0 0 32 32' className={icon} aria-hidden='true'>
        <rect width='32' height='32' rx='8' fill='#2563eb' />
        <path d='M10 8h8l4 4v12a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z' fill='white' />
        <path d='M12.5 17l2.5 2.5 4.5-5' stroke='#2563eb' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' fill='none' />
      </svg>
      {showName && <span className={`${text} font-bold tracking-tight text-slate-900`}>{APP_NAME}</span>}
    </div> 
  )
}

export default Logo