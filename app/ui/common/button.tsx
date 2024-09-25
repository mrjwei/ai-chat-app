import clsx from 'clsx'

export default function Button({type = 'button', className, children, ...props}: JSX.IntrinsicElements["button"]) {
  return (
    <button type={type} className={clsx(
      'px-4 py-2 font-medium',
      className
    )} {...props}>
      {children}
    </button>
  )
}
