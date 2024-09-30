import clsx from 'clsx'

export default function Button({type = 'button', size = 'default', className, children, ...props}: JSX.IntrinsicElements["button"] & {size?: 'default' | 'small'}) {
  return (
    <button type={type} className={clsx(
      'font-medium',
      {
        'px-4 py-2': size === 'default',
        'p-1': size === 'small'
      },
      className
    )} {...props}>
      {children}
    </button>
  )
}
