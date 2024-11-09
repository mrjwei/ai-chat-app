"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import clsx from "clsx"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import Button from "@/app/ui/common/button"

export default function Dropdown({
  className,
  btnClassNameOnOpen,
  btnClassName,
  menuClassName,
  initialLabel,
  hasChevron = true,
  children,
}: {
  className?: string
  btnClassNameOnOpen?: string
  btnClassName?: string
  menuClassName?: string
  initialLabel: string | React.ReactNode
  hasChevron?: boolean
  children: ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOnWindow = (event: MouseEvent) => {
      if (
        btnRef.current &&
        menuRef.current &&
        !btnRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOnWindow)
    return () => document.removeEventListener("click", handleClickOnWindow)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [initialLabel, pathname, searchParams])

  return (
    <div className={clsx(
      className
    )}>
      <Button
        type="button"
        className={clsx(
          `flex items-center justify-between p-1 rounded ${isMenuOpen && btnClassNameOnOpen}`,
          btnClassName
        )}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={btnRef}
      >
        <span className={clsx(
          "whitespace-nowrap overflow-hidden text-ellipsis",
          {
            "mr-1": hasChevron
          }
        )}>{initialLabel}</span>
        {hasChevron && (isMenuOpen ? (
          <ChevronUpIcon className={clsx(
            "size-5",
          )} />
        ) : (
          <ChevronDownIcon className={clsx(
            "size-5",
          )} />
        ))}
      </Button>
      {isMenuOpen && (
        <ul
          className={clsx(
            "bg-white shadow-md rounded p-2 max-h-screen overflow-y-auto",
            menuClassName
          )}
          ref={menuRef}
        >
          {children}
        </ul>
      )}
    </div>
  )
}
